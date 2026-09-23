const { application } = require("express");

const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema(
  {
    stepNumber: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["stageNotStarted", "processing", "approved", "actionRequired"],
      default: "stageNotStarted",
    },
    message: {
      stageNotStarted: {
        type: String,
        default: "",
      },
      processing: {
        type: String,
        default: "",
      },
      approved: {
        type: String,
        default: "",
      },
      actionRequired: {
        type: String,
        default: "",
      },
    },
  },
  { _id: false },
);

const applicantSchema = new mongoose.Schema(
  {
    applicationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: false,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      sparse: true,
      trim: true,
      lowercase: true,
      required: false,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    mustChangePassword: {
      type: Boolean,
      default: true,
    },
    accountStatus: {
      type: String,
      enum: ["temporary", "permanent"],
      default: "temporary",
    },
    applicationStatus: {
      type: String,
      enum: [
        "stageNotStarted",
        "processing",
        "approved",
        "actionRequired",
        "completed",
      ],
      default: "stageNotStarted",
    },
    steps: {
      type: [stepSchema],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staff",
      //required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("applicant", applicantSchema);
