const config = require("config");
const LocalStrategy = require("passport").LocalStrategy;
const JwtStrategy = require("passport-jwt").Strategy;
const {ExtractJwt} = require("passport-jwt");

const User = require("../models/user");

const params = {
  jwtFromRequest: ExtractJwt.fromAuthHeader("authorization"),
  secretOrKey: config.get("JWT_SECRET")
};

module.exports = (passport) => {
  passport.use(new JwtStrategy(params, async (payload, done) => {
    try {
      const user = await User.findById(payload.sub);

      if (!user) {
        return done(null, false);
      }

      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }));

  passport.use(new LocalStrategy({
    userNameField: "email"
  }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false);
      }

      const isValid = user.validatePassword(passport);

      if (!isValid) {
        return done(null, false);
      }

      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }));
};