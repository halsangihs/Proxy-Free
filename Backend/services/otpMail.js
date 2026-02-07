require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function sendLoginOTP(name, email, otp) {
  const mailOptions = {
    from: `"TrackBOOK 📚" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Login OTP for TrackBOOK`,
    html: `
      <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background-color: #fdfdfd; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
  <h2 style="color: #333;">Hi ${name}, 👋</h2>

  <p style="font-size: 16px; color: #555;">
    Your login OTP for <strong style="color: #000;">TrackBOOK</strong> is:
  </p>

  <p style="font-size: 24px; font-weight: bold; color: #1a73e8; margin: 20px 0;">
    ${otp}
  </p>

  <p style="font-size: 16px; color: #555;">
    This OTP is valid for only <strong>10 minutes</strong>. Please do not share it with anyone.
  </p>

  <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

  <p style="font-size: 14px; color: #999; text-align: center;">
    This is an automated message from <strong>TrackBOOK</strong>. Do not reply.
  </p>
</div>

    `,
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) console.log("error occured", error);
    else console.log("otp sent successfully");
  });
}

module.exports = { sendLoginOTP };
