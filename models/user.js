const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema({
  email: {
    type: String,
    required: String,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
});

Schema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(this.password, salt);
  
    this.password = hash;
  
    next();
  } catch (error) {
    next(error);
  }
});

Schema.methods.authenticate = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw Error(error);
  }
}

module.exports = mongoose.model("User", Schema);