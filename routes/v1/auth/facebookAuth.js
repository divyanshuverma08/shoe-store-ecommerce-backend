const express = require("express");
const { createToken } = require("../../../utils/jwt")
const passport = require("passport");
const environment = require("../../../utils/environment");
const router = express.Router();
const axios = require("axios");
const { tryCatch } = require("../../../utils/tryCatch");
const BaseError = require("../../../config/baseError");
const httpStatusCodes = require("../../../config/http");
const userModel = require("../../../model/userModel");

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ['public_profile', 'email'],
    prompt: "select_account",
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
  }),
  (req, res) => {
    if(req.user.status === 400){
        return res.redirect(`${environment.CLIENT_URL}?facebook=false`);
    }else if(req.user.status === 500){
        return res.redirect(`${environment.CLIENT_URL}?auth=false`);
    }
    const payload = {
      id: req.user._id,
      email: req.user.email,
    };
    const token = createToken(payload)
    const params = new URLSearchParams({
      valid: token,
      id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName
    })
    return res.redirect(
      `${environment.CLIENT_URL}?` + params
    );
  }
);

router.get("/facebook/link/user/:id",(req,res) => {
  const id = req.params.id;

  res.redirect(`https://www.facebook.com/v11.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${environment.SERVER_URL}/api/v1/auth/facebook/link/callback&scope=public_profile email` +
  `&state=${id}` 
);
});

router.get('/facebook/link/callback', tryCatch(async (req, res) => {
  const userId = req.query.state;

  const code = req.query.code;
  
  if (!code) {
    throw new BaseError('Authorization code missing',httpStatusCodes.badRequest);
  }

  const response = await axios.post('https://graph.facebook.com/v11.0/oauth/access_token', null, {
    params: {
      code,
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_SECRET,
      redirect_uri: `${environment.SERVER_URL}/api/v1/auth/facebook/link/callback`,
      // grant_type: 'authorization_code',
    },
  });

  if (response.data.access_token) {
    const accessToken = response.data.access_token;

    // Use the access token to fetch user information
    const userInfoResponse = await axios.get(`https://graph.facebook.com/v11.0/me?fields=id,name,email,picture&access_token=${accessToken}`);

    const facebookUserId = userInfoResponse.data.id;

    const linkedUser = await userModel.findOne({ "facebook.id": facebookUserId });

    //If facebook account is linked with other user
    if (linkedUser) {
      return res.redirect(`${environment.CLIENT_URL}/profile?facebooklink=false`);
    }

    if(!userInfoResponse.data.email){
      throw new BaseError('Facebook account does not have a email id',httpStatusCodes.badRequest);
    }

    const user = await userModel.findByIdAndUpdate(userId,{facebook: {
      id: facebookUserId,
      name: userInfoResponse.data.name,
      email: userInfoResponse.data.email,
      accessToken: accessToken
    }},{returnOriginal: false});

    return res.redirect(`${environment.CLIENT_URL}/profile?facebooklink=true`);

  } else {
    throw new BaseError('Failed to obtain access token',httpStatusCodes.badRequest);
  }
}));

module.exports = router;
