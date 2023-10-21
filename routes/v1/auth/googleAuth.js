const express = require("express");
const { createToken } = require("../../../utils/jwt");
const passport = require("passport");
const environment = require("../../../utils/environment");
const router = express.Router();

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

module.exports = router;
