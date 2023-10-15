const router = require("express").Router();
const productController = require("../../controller/productController");
const verifyToken = require("../../middleware/verifyToken");

router.get("/",productController.getAllProductsWithFiltersAndPagination);
router.get("/featured",productController.getFeatured);
router.get("/:id",productController.getProduct);

router.use(verifyToken);

router.post("/",productController.addProduct);
router.put("/:id",productController.updateProduct);


module.exports = router;