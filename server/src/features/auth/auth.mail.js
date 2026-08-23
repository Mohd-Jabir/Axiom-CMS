import "dotenv/config";
import FormData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(FormData);

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
  url: process.env.MAILGUN_BASE_URL || "https://api.mailgun.net",
});

export async function transporterMail(verificationURL, user) {
  try {
    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `${process.env.MAILGUN_FROM_NAME || "Axiom CMS"} <${process.env.MAILGUN_FROM_EMAIL}>`,

      to: [
        `${user.identity.firstName} ${user.identity.lastName} <${user.identity.email}>`,
      ],

      subject: "Verify your Axiom CMS email",

      text: `
Hi ${user.identity.firstName},

Thanks for creating your Axiom CMS account.

Please verify your email by opening this link:

${verificationURL}

If you didn't create an Axiom CMS account,
you can safely ignore this email.

© ${new Date().getFullYear()} Axiom CMS
      `,

      html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Verify your email</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background: #f4f4f5;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border: 1px solid #e4e4e7;
        border-radius: 12px;
        overflow: hidden;
      "
    >

      <div
        style="
          background: #111111;
          color: #ffffff;
          padding: 28px;
          text-align: center;
        "
      >
        <h1 style="margin: 0;">
          Axiom CMS
        </h1>
      </div>

      <div style="padding: 35px 30px;">

        <h2 style="color: #18181b;">
          Verify your email
        </h2>

        <p
          style="
            color: #52525b;
            font-size: 16px;
            line-height: 1.6;
          "
        >
          Hi ${user.identity.firstName},
        </p>

        <p
          style="
            color: #52525b;
            font-size: 16px;
            line-height: 1.6;
          "
        >
          Thanks for creating your Axiom CMS account.
          Please verify your email address by clicking
          the button below.
        </p>

        <div
          style="
            text-align: center;
            margin: 35px 0;
          "
        >
          <a
            href="${verificationURL}"
            style="
              display: inline-block;
              padding: 14px 24px;
              background: #18181b;
              color: #ffffff;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
            "
          >
            Verify Email
          </a>
        </div>

        <p
          style="
            color: #71717a;
            font-size: 14px;
          "
        >
          If the button doesn't work, copy and paste
          this URL into your browser:
        </p>

        <p
          style="
            color: #52525b;
            font-size: 13px;
            word-break: break-all;
          "
        >
          ${verificationURL}
        </p>

        <p
          style="
            color: #71717a;
            font-size: 14px;
            margin-top: 30px;
          "
        >
          If you didn't create an Axiom CMS account,
          you can safely ignore this email.
        </p>

      </div>

      <div
        style="
          padding: 20px;
          background: #fafafa;
          border-top: 1px solid #e4e4e7;
          text-align: center;
        "
      >
        <p
          style="
            margin: 0;
            color: #a1a1aa;
            font-size: 12px;
          "
        >
          © ${new Date().getFullYear()} Axiom CMS
        </p>
      </div>

    </div>
  </body>
</html>
      `,
    });

    console.log("Mailgun email sent:", response);

    return response;
  } catch (error) {
    console.error("Mailgun email error:", error);

    throw new Error("Failed to send verification email");
  }
}