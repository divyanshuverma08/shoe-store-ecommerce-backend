const router = require("express").Router();

router.use(require("./localAuth"));
router.use(require("./googleAuth"));
router.use(require("./facebookAuth"));

module.exports = router;