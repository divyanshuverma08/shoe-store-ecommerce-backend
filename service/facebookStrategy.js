const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const userModel = require("../model/userModel");
const BaseError = require("../config/baseError");
const httpStatusCodes = require("../config/http");
const environment = require("../utils/environment");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: `${environment.SERVER_URL}/api/v1/auth/facebook/callback`,
      profileFields: ['id', 'first_name', 'last_name', 'email', 'picture']
    },
    async (accessToken, refreshToken, profile, done) => {
        try {

            const linkedUser = await userModel.findOne({ "facebook.id": profile.id });
    
            //If facebook account is linked with any user we will allow login
    
            if (linkedUser) {
              return done(null, linkedUser);
            }
    
            const sameEmail = await userModel.findOne({
              email: profile.emails[0].value,
            });
    
            //If facebook account email is same as another user and not linked with any account
    
            if (sameEmail) {
              throw new BaseError(
                "Facebook account is not linked with any user",
                httpStatusCodes.badRequest
              );
            }
    
            //If facebook account email is new
    
            const newUser = await new userModel({
              email: profile.emails[0].value,
              firstName: profile._json.first_name,
              lastName: profile._json.last_name,
              facebook: {
                id: profile.id,
                name: `${profile._json.first_name} ${profile._json.last_name}`,
                email: profile.emails[0].value,
                accessToken,
                refreshToken: refreshToken !== undefined ? refreshToken : ""
              },
            }).save();
            return done(null, newUser);
          } catch (err) {
            if(err.message || err.statusCode){
                return done(null,{status: err.statusCode,message: err.message});
            }else{
                return done(null,{status: 500,message: "Unknown error"});
            }
          }
    }
  )
);
