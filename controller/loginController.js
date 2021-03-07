const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const loginRender = (req, res) => {
  res.render("login.ejs", { err: "" });
};

const loginSubmit = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) return res.redirect("/register");

  const validUser = await bcrypt.compare(password, user.password);

  if (!validUser) return res.redirect("/login");

  // npm paket: connect-flash för att kunna spara felmeddelanden när vi redirectar

  const jwtToken = await jwt.sign({ user: user }, process.env.SECRET_KEY);

  if (jwtToken) {
    const cookie = req.cookies.jwtToken;
    if (!cookie) {
      res.cookie("jwtToken", jwtToken, { maxAge: 3600000, httpOnly: true });
    }

    return res.redirect("/");
  }

  return res.redirect("/login");
};

const googleSubmit = async (req, res) => {
  const token = req.body.token;
  console.log(token)
  const name = req.body.profileName
  const email = req.body.profileEmail
  console.log(email)

  const user = await User.findOne({ email });


  if(!user) {

  try {
    console.log("hej")
    await new User({
      name: name,
      email: email,
    }).save();
  } catch (err) {
    if (err) return res.render("register.ejs", { err: err });
  }
  } console.log(user)

  res.redirect("/")
}

module.exports = {
  loginRender,
  loginSubmit,
  googleSubmit
};
