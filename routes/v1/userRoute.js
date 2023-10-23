const router = require("express").Router();
const userController = require("../../controller/userController");
const verifyToken = require("../../middleware/verifyToken");

router.use(verifyToken);

router.get("/:id",userController.getUser);
router.put("/:id",userController.updateUser);
//this is for users who already have a password and want to update
router.put("/password/update",userController.updatePassword)
//this is for users who signed up using social auth and don't have password and want to set a password
router.put("/password/create",userController.setPassword)

module.exports = router;