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

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
