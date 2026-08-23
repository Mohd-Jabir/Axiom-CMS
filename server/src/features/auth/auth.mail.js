import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  requireTLS: true,

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP VERIFICATION FAILED:", error);
  } else {
    console.log("SMTP SERVER READY:", success);
  }
});
export default transporter;
