const express = require("express");
const { createToken } = require("../../../utils/jwt")
const passport = require("passport");
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
        return res.redirect("https://kicks-ecommerce-store.vercel.app?facebook=false");
    }else if(req.user.status === 500){
        return res.redirect("https://kicks-ecommerce-store.vercel.app?auth=false");
    }
    const payload = {
      id: req.user._id,
      email: req.user.email,
    };
    const token = createToken(payload)
    var string = encodeURIComponent(`${token}`);
    return res.redirect("https://kicks-ecommerce-store.vercel.app?valid=" + string);
  }
);

module.exports = router;
