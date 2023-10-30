const router = require("express").Router();
const orderController = require("../../controller/orderController");
const verifyToken = require("../../middleware/verifyToken");
const publicAndProtectedApiCheck = require("../../middleware/publicAndProtectedApiCheck");

router.post("/",publicAndProtectedApiCheck,orderController.addOrder);

router.post("/checkout/:orderId",publicAndProtectedApiCheck,orderController.orderCheckout)

router.use(verifyToken);

router.put("/paymentStatus/:id",orderController.updateOrderPaymentStatus);
router.put("/status/:id",orderController.updateOrderStatus);
router.get("/",orderController.getOrders);
router.get("/:id",orderController.getOrderById);
router.get("/user/:id",orderController.getOrdersByUser);

module.exports = router;