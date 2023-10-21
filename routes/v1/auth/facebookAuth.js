const express = require("express");
const { createToken } = require("../../../utils/jwt")
const passport = require("passport");
const environment = require("../../../utils/environment");
const router = express.Router();

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
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName
    })
    return res.redirect(
      `${environment.CLIENT_URL}?` + params
    );
  }
);

module.exports = router;
