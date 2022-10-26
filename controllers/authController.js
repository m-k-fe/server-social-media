const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { handleRegisterErrors, handleLoginErrors } = require("../utils/errors");
const secretKey = process.env.SECRET_KEY;
const maxAge = 3 * 24 * 60 * 60 * 1000;
const registerUser = async (req, res) => {
  const { pseudo, email, password } = req.body;
  try {
    const user = await new User({
      pseudo,
      email,
      password,
    });
    const newUser = await user.save();
    res.status(201).json({ user: newUser._id });
  } catch (err) {
    const errors = handleRegisterErrors(err);
    res.status(400).json({ errors });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const isExistUser = await User.login(email, password);
    const token = jwt.sign({ _id: isExistUser._id }, secretKey, {
      expiresIn: maxAge,
    });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge,
      sameSite: "none",
      secure: true,
    });
    res.status(201).json({ user: isExistUser._id });
  } catch (err) {
    const errors = handleLoginErrors(err);
    res.status(402).json({ errors });
  }
};
const logoutUser = async (req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.redirect("/");
};
module.exports = {
  loginUser,
  registerUser,
  logoutUser,
};
