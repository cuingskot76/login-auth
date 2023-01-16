import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    // console.log(token);

    // 401 = unauthorize
    if (token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      // 403 = forbidden
      if (err) return res.sendStatus(403);
      // decoded.email = didalam token terdapat email
      req.email = decoded.email;
      next();
    });
  } catch (error) {
    res.status(404).json({ msg: "Email doesn't exist" });
  }
};
