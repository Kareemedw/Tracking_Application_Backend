const bcrypt = require("bcryptjs");
const Applicant = require("../models/applicant");
const defaultSteps = require("../utils/defaultsteps");
const generateTemporaryPassword = require("../utils/generateTemporaryPassword");
const BadRequestStatusCode = require("../utils/errors/BadRequestStatus");
const sendApplicantEmail = require("../utils/sendApplicantEmail");

const createApplicant = async (req, res, next) => {
  try {
    console.log("REQUEST BODY:", req.body);
    const { applicationNumber, firstName, lastName, email } = req.body;

    const existingApplicant = await Applicant.findOne({ applicationNumber });

    if (existingApplicant) {
      return res.status(409).send({
        message: "An applicant with this application number already exists.",
      });
    }

    const temporaryPassword = generateTemporaryPassword();

    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const applicant = await Applicant.create({
      applicationNumber,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mustChangePassword: true,
      //createdBy: req.user._id,
      steps: defaultSteps.map((steps) => ({
        ...steps,
        message: {
          ...steps.message,
        },
      })),
    });

    await sendApplicantEmail({
      email: applicant.email,
      firstName: applicant.firstName,
      applicationNumber: applicant.applicationNumber,
      temporaryPassword,
    });

    return res.status(201).send({
      applicant: {
        _id: applicant._id,
        applicationNumber: applicant.applicationNumber,
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        email: applicant.email,
      },

      message: "Applicant created and login instructions emailed successfully.",
    });
  } catch (err) {
    return next(err);
  }
};

const getApplicants = async (req, res, next) => {
  try {
    const applicants = await Applicant.find({})
      .select(
        "firstName lastName applicationNumber accountStatus applicationStatus",
      )
      .sort({ createdAt: -1 });

    return res.send(applicants);
  } catch (err) {
    return next(err);
  }
};

const getApplicant = async (req, res, next) => {
  try {
    const { applicantId } = req.params;

    const applicant = await Applicant.findById(req.params.applicantId);

    if (!applicant) {
      return res.status(404).send({
        message: "Applicant not found",
      });
    }

    return res.send(applicant);
  } catch (err) {
    return next(err);
  }
};

const updateApplicantStep = async (req, res, next) => {
  try {
    const { applicantId, stepNumber } = req.params;

    const { status, actionRequiredMessage } = req.body;

    console.log("========== PATCH STEP ==========");
    console.log("applicantId:", applicantId);
    console.log("stepNumber:", stepNumber);
    console.log("req.body:", req.body);
    console.log("actionRequiredMessage:", actionRequiredMessage);

    const applicant = await Applicant.findById(applicantId);

    if (!applicant) {
      return res.status(404).send({
        message: "Applicant not found",
      });
    }

    const step = applicant.steps.find(
      (item) => item.stepNumber === Number(stepNumber),
    );

    if (!step) {
      return res.status(404).send({
        message: "Application stage not found",
      });
    }

    if (status !== undefined) {
      step.status = status;
    }

    if (actionRequiredMessage !== undefined) {
      step.message.actionRequired = actionRequiredMessage;
    }

    await applicant.save();

    return res.send(applicant);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createApplicant,
  getApplicants,
  getApplicant,
  updateApplicantStep,
};
