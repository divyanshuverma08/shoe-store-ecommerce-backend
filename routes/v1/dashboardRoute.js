const router = require("express").Router();
const dashboardController = require("../../controller/dashboardController");
const verifyToken = require("../../middleware/verifyToken");

router.use(verifyToken);

router.get("/",dashboardController.getDashboardDetails);
router.get("/orders/year",dashboardController.getOrdersByYear);
router.get("/orders/month",dashboardController.getOrdersByMonth);
router.get("/bestSellers",dashboardController.getBestSellers);

module.exports = router;