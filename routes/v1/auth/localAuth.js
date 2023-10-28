const router = require("express").Router();
const authController = require('../../../controller/authController')

router.post("/register",authController.register);
router.post("/login",authController.login)
router.post("/admin/register",authController.adminRegister);
router.post("/admin/login",authController.adminLogin)

module.exports = router;