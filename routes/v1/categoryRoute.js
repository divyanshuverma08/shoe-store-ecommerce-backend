const router = require("express").Router();
const categoryController = require("../../controller/categoryController");
const verifyToken = require("../../middleware/verifyToken");

router.use(verifyToken);

router.post("/",categoryController.addCategory);
router.get("/",categoryController.getCategories);
router.get("/:id",categoryController.getCategory);
router.put("/:id",categoryController.updateCategory);

module.exports = router;