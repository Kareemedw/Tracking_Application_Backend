const express = require("express");
const router = express.Router();

const {
  getCustomerApplicants,
  getCustomerApplicant,
  signinApplicant,
  changeApplicantPassword,
} = require("../controllers/customers");

const auth = require("../middlewares/auth");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.post("/signin", signinApplicant);

router.use(auth, authorizeRoles("customer"));

router.patch(
  "/change-password",
  auth,
  authorizeRoles("customer"),
  changeApplicantPassword,
);

router.get("/", auth, getCustomerApplicants);

router.get("/:applicantId", auth, getCustomerApplicant);

module.exports = router;
