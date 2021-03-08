const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRouter = require("./router/userRouter");
const homeRoute = require("./router/homeRoute");
require("dotenv").config();
const app = express();

const passport = require("passport")
const GooglePlusTokenStrategy = require("passport-google-plus-token")

const User = require("./model/user");

// GOOGLE
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = process.env.CLIENT_ID
const client = new OAuth2Client(CLIENT_ID);


//Middlewares
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("public"));
app.use(userRouter);
app.use(homeRoute);





mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err);
      return;
    }
    app.listen(8000, () => {
      console.log("App is running");
    });
  }
);

// // GOOGLE OAUTH STRATEGY
// passport.use('googleToken', new GooglePlusTokenStrategy({
//   clientID: '346094190136-jmcpduv6n6lv55vu8keoubbp6bttgv3k.apps.googleusercontent.com',
//   clientSecret: 'm_HuwxyfbV63Q-HQ_AIghPd0'
// }, async(accesToken, refreshToken, profile, done)=> {
//   console.log('accesToken', accesToken)
//   console.log('refreshToken', refreshToken)
//   console.log('profile', profile)
// }))

// app.get('/auth/google', (req, res) => {
//   console.log("hej")
//   res.redirect()
// }).post((req, res) => {
//   console.log("hej igen")
// }) 




