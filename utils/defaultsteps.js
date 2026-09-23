const defaultSteps = [
  {
    stepNumber: 1,
    label: "Mission is in receipt of your application",
    status: "processing",

    message: {
      processing:
        "Your application has been received by the Missiion and is currently being reviewed.",
      approved:
        "Your application has passed first screening and is being prepared to be sent to the Immigration office",
      actionRequired: "",
    },
  },
  {
    stepNumber: 2,
    label: "Application passes first screening",
    status: "stageNotStarted",

    message: {
      stageNotStarted: "This stage is not started",

      processing: "Your application is enroute to the Immigration Office.",

      approved: "Your application has arrived at the Immigration Office.",

      actionRequired: "",
    },
  },

  {
    stepNumber: 3,
    label: "Immigration Office is in receipt of your application",
    status: "stageNotStarted",

    message: {
      stageNotStarted: "This stage is not started",

      processing:
        "The Immigration Office has received your application and is currently conducting its review.",

      approved: "Your application has been approved.",

      actionRequired: "",
    },
  },

  {
    stepNumber: 4,
    label: 'Application approved and "Document" sent to Mission',

    status: "stageNotStarted",

    message: {
      stageNotStarted: "This stage is not started",

      processing:
        "The Immigration Office is preparing to dispatch your document to the Mission.",

      approved: "The Immigration Office has dispatched your document.",

      actionRequired: "",
    },
  },

  {
    stepNumber: 5,
    label: 'Mission is in receipt of your "Document"',

    status: "stageNotStarted",

    message: {
      stageNotStarted: "This stage is not started",

      processing:
        "The Mission has received your document and is preparing to mail it to your address on file.",

      approved: "The Mission has mailed your document.",

      actionRequired: "",
    },
  },
];

module.exports = defaultSteps;
