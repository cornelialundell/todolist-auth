const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = process.env.CLIENT_ID
const client = new OAuth2Client(CLIENT_ID);

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
  console.log(jwtToken)

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
  const name = req.body.profileName
  const email = req.body.profileEmail
  

  const user = await User.findOne({ email });



  if(!user) {

  try {
    await new User({
      name: name,
      email: email,
      typeoflogin: 'google'
    }).save()
    
  } catch (err) {
    if (err) return res.render("register.ejs", { err: err });
  }
  } 



  const jwtToken = await jwt.sign(JSON.stringify({ user: user }), process.env.SECRET_KEY)

  if (jwtToken) {
    const cookie = req.cookies.jwtToken;
    if (!cookie) {
      res.cookie("jwtToken", jwtToken, { maxAge: 3600000, httpOnly: true })
    }
    console.log('din cookie är' + req.cookies.jwtToken)

    return res.redirect("/")
  }

  return res.redirect("/login");

  // //VERIFY
  // async function verify() {
  //   const ticket = await client.verifyIdToken({
  //       idToken: token,
  //       audience: CLIENT_ID, 
  //   });
  //   const payload = ticket.getPayload();
  //   const userid = payload['sub'];
  // }
  // verify().then(() => {
  //   res.cookie('session-token', token);
  //   res.send('success')
  // })
  // .catch(console.error);
}

module.exports = {
  loginRender,
  loginSubmit,
  googleSubmit
};