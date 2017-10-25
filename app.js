"use strict";

const path = require("path");
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const config = require("config");

const users = require("./routes/users");
const validateSchema = require("./lib/middleware/validate-schema");
const auth = require("./lib/auth");

mongoose.Promise = global.Promise;
mongoose.connect(config.get("db.uri"), config.get("db.opts"));

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(auth.initialize());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/users/signup", validateSchema("user"), users.signup);
app.post("/api/users/signin", validateSchema("user"), auth.authenticate(), users.signin);

app.use(function(req, res, next) {
  res.status(404).json({error: new Error("Not Found")});
});

module.exports = app;