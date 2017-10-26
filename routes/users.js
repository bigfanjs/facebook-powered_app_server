const User = require("../models/user");
const signToken = require("../lib/sign-token");

exports.signup = async function (req, res, next) {
  const {email, password} = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return res.status(403).json({ error: "Email is already in use" });
  }

  const newUser = new User({email, password});
  await newUser.save();

  const token = signToken(newUser);

  res.status(200).json({token});
}

exports.signin = function (req, res, next) {
  const token = signToken(req.user);
  res.status(200).json({token});
}

exports.getUser = function (req, res, next) {
  res.status(200).json({user: req.user});
}