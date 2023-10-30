const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const userModel = require("../model/userModel");
const BaseError = require("../config/baseError");
const httpStatusCodes = require("../config/http");
const environment = require("../utils/environment");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${environment.SERVER_URL}/api/v1/auth/google/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const linkedUser = await userModel.findOne({ "google.id": profile.id });

        //If google account is linked with any user we will allow login

        if (linkedUser) {
          return done(null, linkedUser);
        }

        const sameEmail = await userModel.findOne({
          email: profile.emails[0].value,
        });

        //If google account email is same as another user and not linked with any account

        if (sameEmail) {
          throw new BaseError(
            "Google account is not linked with any user",
            httpStatusCodes.badRequest
          );
        }

        //If google account email is new

        const newUser = await new userModel({
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          google: {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            accessToken,
            refreshToken: refreshToken !== undefined ? refreshToken : "",
          },
        }).save();
        return done(null, newUser);
      } catch (err) {
        if (err.message || err.statusCode) {
          return done(null, { status: err.statusCode, message: err.message });
        } else {
          return done(null, { status: 500, message: "Unknown error" });
        }
      }
    }
  )
);
