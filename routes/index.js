const router = require("express").Router();
const mainRouter = require("./applicants");

router.use("/applicants", mainRouter);

module.exports = router;
