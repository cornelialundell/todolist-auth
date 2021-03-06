const express = require("express");

const router = express.Router();

const {
  registerRender,
  registerSubmit,
} = require("../controller/registerController");

const { loginRender, loginSubmit, googleSubmit } = require("../controller/loginController");

const verifyToken = require("../middleware/verifyUser");

const {
  resetRender,
  resetSubmit,
  resetParams,
  resetFormSubmit,
} = require("../controller/resetPassword");

router.get("/register", registerRender);

router.post("/register", registerSubmit);

router.get("/login", loginRender);

router.post("/login", loginSubmit);

router.post("/google", googleSubmit)

router.get("/reset", resetRender);

router.post("/reset", resetSubmit);

router.get("/reset/:token", resetParams);

router.post("/resetPasswordForm", resetFormSubmit);

module.exports = router;
