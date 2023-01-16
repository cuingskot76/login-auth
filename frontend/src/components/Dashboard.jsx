import axios from "axios";
import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      // const response = await axios.get("http://localhost:5000/token");
      // setToken(response.data.accessToken);
      // const decoded = jwt_decode(response.data.accessToken);
      // console.log(decoded);
      const res = await axios.get("http://localhost:5000/token");
      console.log(res.data);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
      }
    }
  };

  // useEffect(() => {
  //   getUser();
  // }, []);

  // const getUser = async () => {
  //   try {
  //     await axios.get("http://localhost:5000/token");
  //   } catch (err) {
  //     // if (err.response) {
  //     //   console.log(err.response.data);
  //     // }
  //     console.log(err);
  //   }
  // };

  return (
    <div className="flex justify-center h-screen items-center">
      <h1 className="text-3xl">Welcome back, {name} 👋</h1>
    </div>
  );
};

export default Dashboard;
