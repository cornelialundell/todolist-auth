// verify token from user
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../model/user");

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwtToken;
  if (!token) return res.render("login.ejs", { err: "Du måste logga in" });

  const validUser = jwt.verify(token, process.env.SECRET_KEY);

  //Läser in token data
  if (validUser) {
    req.user = validUser;
  }
  next();
};

module.exports = verifyToken;
