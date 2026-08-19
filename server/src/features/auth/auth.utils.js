import jwt from "jsonwebtoken";
import crypto from "crypto";
import transporter from "./auth.mail.js";
export function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      role: user.authorization.role,
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: "20m",
    },
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    {
      userId: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: "30d",
    },
  );
}

export function hashRefreshToken(refreshToken) {
  return crypto.createHash("sha256").update(refreshToken).digest("hex");
}
export function verifyRefreshToken(refreshToken) {
  return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
}
export function getTokenExpiry(refreshToken) {
  const decoded = jwt.decode(refreshToken);
  return new Date(decoded.exp * 1000);
}

export function generateEmailVerificationToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      purpose: "email-verification",
    },
    process.env.EMAIL_VERIFICATION_SECRET_KEY,
    { expiresIn: "24h" },
  );
}
export function verifyEmailVerificationToken(token) {
  return jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET_KEY);
}
export async function transporterMail(verificationURL, user) {
  const info = await transporter.sendMail({
    from: `"Axiom CMS" <${process.env.EMAIL_USER}>`,
    to: user.identity.email,
    subject: "Verify your Email",
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify your Email - Axiom CMS</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background-color: #f5f7fa;
            font-family: Arial, Helvetica, sans-serif;
            color: #1f2937;
          "
        >
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="background-color: #f5f7fa; padding: 40px 15px;"
          >
            <tr>
              <td align="center">

                <!-- Main Container -->
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    max-width: 600px;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
                  "
                >

                  <!-- Header -->
                  <tr>
                    <td
                      style="
                        background-color: #1f2937;
                        padding: 28px 30px;
                        text-align: center;
                      "
                    >
                      <h1
                        style="
                          margin: 0;
                          color: #ffffff;
                          font-size: 28px;
                          font-weight: 700;
                          letter-spacing: 0.5px;
                        "
                      >
                        Axiom CMS
                      </h1>

                      <p
                        style="
                          margin: 8px 0 0;
                          color: #d1d5db;
                          font-size: 14px;
                        "
                      >
                        Content Management System
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 35px;">

                      <h2
                        style="
                          margin: 0 0 20px;
                          font-size: 24px;
                          color: #1f2937;
                        "
                      >
                        Welcome to Axiom CMS 👋
                      </h2>

                      <p
                        style="
                          margin: 0 0 15px;
                          font-size: 16px;
                          line-height: 1.6;
                          color: #374151;
                        "
                      >
                        Hello <strong>${user.identity.firstName}</strong>,
                      </p>

                      <p
                        style="
                          margin: 0 0 25px;
                          font-size: 15px;
                          line-height: 1.7;
                          color: #6b7280;
                        "
                      >
                        Thank you for creating an account with Axiom CMS.
                        Please verify your email address to activate your
                        account and continue using the platform.
                      </p>

                      <!-- Verification Button -->
                      <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                      >
                        <tr>
                          <td align="center" style="padding: 10px 0 30px;">

                            <a
                              href="${verificationURL}"
                              style="
                                display: inline-block;
                                background-color: #ff6b4a;
                                color: #ffffff;
                                text-decoration: none;
                                font-size: 16px;
                                font-weight: 600;
                                padding: 14px 30px;
                                border-radius: 8px;
                              "
                            >
                              Verify Email
                            </a>

                          </td>
                        </tr>
                      </table>

                      <!-- Alternative Link -->
                      <div
                        style="
                          border-top: 1px solid #e5e7eb;
                          padding-top: 25px;
                        "
                      >
                        <p
                          style="
                            margin: 0 0 10px;
                            font-size: 14px;
                            color: #6b7280;
                          "
                        >
                          If the button above does not work, copy and paste
                          the following link into your browser:
                        </p>

                        <p
                          style="
                            margin: 0;
                            padding: 12px;
                            background-color: #f9fafb;
                            border: 1px solid #e5e7eb;
                            border-radius: 6px;
                            word-break: break-all;
                            font-size: 13px;
                            line-height: 1.5;
                          "
                        >
                          <a
                            href="${verificationURL}"
                            style="
                              color: #ff6b4a;
                              text-decoration: none;
                            "
                          >
                            ${verificationURL}
                          </a>
                        </p>
                      </div>

                      <p
                        style="
                          margin: 25px 0 0;
                          font-size: 13px;
                          line-height: 1.6;
                          color: #9ca3af;
                        "
                      >
                        If you did not create an account with Axiom CMS,
                        you can safely ignore this email.
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td
                      style="
                        background-color: #f9fafb;
                        border-top: 1px solid #e5e7eb;
                        padding: 22px 30px;
                        text-align: center;
                      "
                    >
                      <p
                        style="
                          margin: 0 0 6px;
                          font-size: 13px;
                          color: #6b7280;
                        "
                      >
                        © ${new Date().getFullYear()} Axiom CMS. All rights
                        reserved.
                      </p>

                      <p
                        style="
                          margin: 0;
                          font-size: 12px;
                          color: #9ca3af;
                        "
                      >
                        This is an automated email. Please do not reply.
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });

  return info;
}
