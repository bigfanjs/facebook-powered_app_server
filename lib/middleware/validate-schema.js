const Ajv = require("ajv");

const userSchema = require("../data/schemas/user.json");

const ajv = Ajv({allErrors: true, removeAdditional: "all"});

ajv.addSchema("user", userSchema);

module.exports = (name) => (req, res, next) => {
  const isValid = ajv.validate(name, req.body);

  if (!valid) {
    return res.status(400).json(ajv.errors);
  }

  next();
};