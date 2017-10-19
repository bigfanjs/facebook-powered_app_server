"use strict";

const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const config = require("config");

const users = require("./routes/users");
const validateSchema = require("./lib/middleware/validate-schema");
const auth = require("./lib/auth");

mongoose.Promise = global.Promise;
mongoose.connect(config.get("database.uri"));

const app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(auth.initialize());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.post("/signup", validateSchema("user"), users.signup);
app.post("/signin", validateSchema("user"), auth.authenticate(), users.signin);

app.use(function(req, res, next) {
  res.status(404).json({error: new Error("Not Found")});
});

module.exports = app;