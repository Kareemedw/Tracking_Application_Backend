const router = require("express").Router();
const mainStaffRouter = require("./applicants");
const mainCustomerRouter = require("./customers");

router.use("/applicants", mainStaffRouter);
router.use("/customers", mainCustomerRouter);

module.exports = router;
