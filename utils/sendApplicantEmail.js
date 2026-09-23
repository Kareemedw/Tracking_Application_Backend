const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendApplicantEmail = async ({
  email,
  firstName,
  applicationNumber,
  temporaryPassword,
}) => {
  const loginUrl = `${process.env.CLIENT_URL}`;

  const { data, error } = await resend.emails.send({
    from: "Tracking Application <onboarding@resend.dev>",
    to: email,
    subject: "Your Application Tracking Account",
    html: `
      <h2>Welcome, ${firstName}</h2>

      <p>
        An account has been created for you to track your application.
      </p>

      <p>
        <strong>Application Number:</strong>
        ${applicationNumber}
      </p>

      <p>
        <strong>Temporary Password:</strong>
        ${temporaryPassword}
      </p>

      <p>
        Please log in using your application number and temporary password.
      </p>

      <p>
        You will be required to create a new password after logging in.
      </p>

      <a href="${loginUrl}">
        Log in to your account
      </a>

      <p>
        For security, please do not share your temporary password.
      </p>
    `,
  });

  if (error) {
    throw new Error(`Unable to send applicant email: ${error.message}`);
  }

  return data;
};

module.exports = sendApplicantEmail;
