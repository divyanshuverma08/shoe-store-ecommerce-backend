const router = require("express").Router();
const apiKeyVerification = require("../../middleware/apiKeyVerification");

router.use("/auth",require("./auth"));

router.use(apiKeyVerification);

router.use("/users",require("./userRoute"));
router.use("/category",require("./categoryRoute"));
router.use("/products",require("./productRoute"));
router.use("/orders",require("./orderRoute"));
router.use("/dashboard",require("./dashboardRoute"))

router.get('/', (req,res)=>{
    res.send("Buy shoes at KICKS");
})

module.exports = router;