const router = require("express").Router();
const apiKeyVerification = require("../../middleware/apiKeyVerification");

router.use(apiKeyVerification);

router.use("/auth",require("./auth"))
router.use("/category",require("./categoryRoute"))
router.use("/products",require("./productRoute"));
router.use("/orders",require("./orderRoute"));

router.get('/', (req,res)=>{
    console.log("Called");
    res.send("Buy shoes at KICKS");
})

module.exports = router;