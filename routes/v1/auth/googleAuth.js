const express = require("express");
const { createToken } = require("../../../utils/jwt");
const passport = require("passport");
const environment = require("../../../utils/environment");
const router = express.Router();
const axios = require("axios");
const { tryCatch } = require("../../../utils/tryCatch");
const BaseError = require("../../../config/baseError");
const httpStatusCodes = require("../../../config/http");
const userModel = require("../../../model/userModel");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  (req, res) => {
    if (req.user.status === 400) {
      return res.redirect(
        `${environment.CLIENT_URL}?google=false`
      );
    } else if (req.user.status === 500) {
      return res.redirect(
        `${environment.CLIENT_URL}?auth=false`
      );
    }
    const payload = {
      id: req.user._id,
      email: req.user.email,
    };
    const token = createToken(payload);
    const params = new URLSearchParams({
      valid: token,
      id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName
    })
    // res.cookie("auth", JSON.stringify(token),{domain: "kicks-ecommerce-store.vercel.app"});
    return res.redirect(
      `${environment.CLIENT_URL}?` + params
    );
  }
);

router.get("/google/link/user/:id",(req,res) => {
  const id = req.params.id;

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth` +
  `?client_id=${process.env.GOOGLE_CLIENT_ID}` +
  `&redirect_uri=${environment.SERVER_URL}/api/v1/auth/google/link/callback` +
  `&scope=openid profile email` +
  `&response_type=code` +
  '&prompt=select_account' +
  `&state=${id}` 
);
});

router.get('/google/link/callback', tryCatch(async (req, res) => {
  const userId = req.query.state;

  const code = req.query.code;
  
  if (!code) {
    throw new BaseError('Authorization code missing',httpStatusCodes.badRequest);
  }

  const response = await axios.post('https://oauth2.googleapis.com/token', null, {
    params: {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${environment.SERVER_URL}/api/v1/auth/google/link/callback`,
      grant_type: 'authorization_code',
    },
  });

  if (response.data.access_token) {
    const accessToken = response.data.access_token;

    // Use the access token to fetch user information
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const googleUserId = userInfoResponse.data.sub;

    const linkedUser = await userModel.findOne({ "google.id": googleUserId });

    //If google account is linked with other user
    if (linkedUser) {
      return res.redirect(`${environment.CLIENT_URL}/profile?googlelink=false`);
    }

    const user = await userModel.findByIdAndUpdate(userId,{google: {
      id: googleUserId,
      name: userInfoResponse.data.name,
      email: userInfoResponse.data.email,
      accessToken: accessToken
    }},{returnOriginal: false});

    return res.redirect(`${environment.CLIENT_URL}/profile?googlelink=true`);

  } else {
    throw new BaseError('Failed to obtain access token',httpStatusCodes.badRequest);
  }
}));

module.exports = router;
