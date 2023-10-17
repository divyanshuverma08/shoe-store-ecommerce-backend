const router = require("express").Router();
const orderController = require("../../controller/orderController");
const verifyToken = require("../../middleware/verifyToken");


router.use(verifyToken);

router.post("/",orderController.addOrder);
router.put("/paymentStatus/:id",orderController.updateOrderPaymentStatus);
router.put("/status/:id",orderController.updateOrderStatus);
router.get("/",orderController.getOrders);
router.get("/user/:id",orderController.getOrdersByUser);

module.exports = router;