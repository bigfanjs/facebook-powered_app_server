const Ajv = require("ajv");

const userSchema = require("../../new-user.schema.json");

const ajv = Ajv({allErrors: true, removeAdditional: "all"});

ajv.addSchema(userSchema, "user");

module.exports = (name) => (req, res, next) => {
  const isValid = ajv.validate(name, req.body);

  if (!valid) {
    return res.status(400).json(ajv.errors);
  }

  next();
};