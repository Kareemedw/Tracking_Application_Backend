const mongoose = require("mongoose");
const Applicant = require("../models/applicant");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const getCustomerApplicants = async (req, res, next) => {
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

const getCustomerApplicant = async (req, res, next) => {
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

const signinApplicant = async (req, res, next) => {
  try {
    const { applicationNumber, lastName, password } = req.body;

    if (
      typeof applicationNumber !== "string" ||
      typeof lastName !== "string" ||
      typeof password !== "string" ||
      !applicationNumber.trim() ||
      !lastName.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Application number, last name and password are required.",
      });
    }

    const applicant = await Applicant.findOne({
      applicationNumber: applicationNumber.trim(),
    }).select("+password");

    if (
      !applicant ||
      applicant.lastName.toLowerCase() !== lastName.trim().toLowerCase()
    ) {
      return res.status(401).json({
        message: "Invalid login credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, applicant.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid login credentials",
      });
    }

    const token = jwt.sign(
      {
        id: applicant._id.toString(),
        role: "customer",
      },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    return res.status(200).json({
      token,
      mustChangePassword: applicant.mustChangePassword,
      applicant: {
        id: applicant._id.toString(),
        applicationNumber: applicant.applicationNumber,
        firstName: applicant.firstName,
        lastName: applicant.lastName,
      },
    });
  } catch (err) {
    next(err);
  }
};

const changeApplicantPassword = async (req, res, next) => {
  try {
    const { newPassword, confirmPassword } = req.body;

    if (
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string" ||
      newPassword.length < 6 ||
      newPassword !== confirmPassword
    ) {
      return res.status(400).json({
        message: "Passwords must match and contain at least 6 characters.",
      });
    }

    const applicant = await Applicant.findById(req.user._id).select(
      "+password",
    );

    if (!applicant) {
      return res.status(404).json({
        message: "Applicant not found",
      });
    }

    if (!applicant.mustChangePassword) {
      return res.status(403).json({
        message: "Temporary password change is not required.",
      });
    }

    const samePassword = await bcrypt.compare(newPassword, applicant.password);

    if (samePassword) {
      return res.status(400).json({
        message: "Choose a different password.",
      });
    }

    applicant.password = await bcrypt.hash(newPassword, 12);
    applicant.mustChangePassword = false;
    applicant.accountStatus = "permanent";

    await applicant.save();

    return res.status(200).json({
      message: "Password updated successfully.",
      mustChangePassword: false,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCustomerApplicant,
  getCustomerApplicants,
  signinApplicant,
  changeApplicantPassword,
};
