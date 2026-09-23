const router = require("express").Router();

const {
  createApplicant,
  getApplicants,
  getApplicant,
  updateApplicantStep,
} = require("../controllers/applicants");

const auth = require("../middlewares/auth");
//const requireDepartmentA = require("../middlewares/requireDepartmentA");

router.get("/", /* auth,*/ getApplicants);

router.get("/:applicantId", /*auth, */ getApplicant);

router.post("/", /*auth, requireDepartmentA,*/ createApplicant);

router.patch("/:applicantId/steps/:stepNumber", /* auth,*/ updateApplicantStep);

module.exports = router;
