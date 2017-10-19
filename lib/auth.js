const config = require("config");
const passport = require("passport");
const LocalStrategy = require("passport").LocalStrategy;
const {ExtractJwt, Strategy} = require("passport-jwt");

const params = {
  local: {
    userNameField: "email"
  },
  jwt: {
    jwtFromRequest: ExtractJwt.fromAuthHeader("authorization"),
    secretOrKey: config.get("JWT_SECRET")
  }
};

passport.use(new JwtStrategy(params.jwt, async (payload, done) => {
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

passport.use(new LocalStrategy(params.local, async (email, password, done) => {
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

module.exports = {
  initialize() {
    return passport.initialize();
  },
  authenticate() {
    return passport.authenticate("local", {session: config.get("session")});
  }
};