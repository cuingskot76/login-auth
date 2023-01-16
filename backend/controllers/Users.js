import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      // hanya mengambil atribut id, name, dan email dari db
      // attributes: ["id", "name", "email"],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const Register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  if (password !== confPassword)
    return res.status(400).json({ msg: "Password doesn't match" });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    res.json({ msg: "Register success" });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({ where: { email: req.body.email } });
    const match = await bcrypt.compare(req.body.password, user[0].password);

    if (!match) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;

    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "20s" }
    );

    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // store refresh token to db, with colomn name refresh_token
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );

    // this cookie is send to client
    // refreshTokonCookie is the name of the cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // if we used https
      // secure: true,
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "Email doesn't exist" });
  }
};

export const Logout = async (req, res) => {
  // const refreshToken = req.cookies.refreshToken;
  const refreshToken = req.cookies.refreshToken;

  //  204 = no content
  if (!refreshToken) return res.sendStatus(204);

  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });

  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;

  await Users.update(
    { refreshToken: null },
    {
      // check user id based on db
      where: {
        id: userId,
      },
    }
  );

  // delete the cookie
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
