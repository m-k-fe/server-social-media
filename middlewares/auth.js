const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const secretKey = process.env.SECRET_KEY;
const checkUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, secretKey, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.cookie("token", "", { maxAge: 1 });
        next();
      } else {
        const user = await User.findOne({ _id: decodedToken._id }).select(
          "-password"
        );
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, secretKey, async (err, decodedToken) => {
      if (err) {
        console.log(err);
      } else {
        console.log(decodedToken._id);
        next();
      }
    });
  } else {
    console.log("No Token");
  }
};
module.exports = {
  checkUser,
  requireAuth,
};
