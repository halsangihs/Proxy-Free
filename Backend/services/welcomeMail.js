require("dotenv").config();
const nodemailer= require("nodemailer")

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    },
})

function sendWelcomeEmail(name, email) {
  const mailOptions = {
    from: `"TrackBOOK 📚" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Welcome to TrackBOOK, ${name}!`,
    html: `
      <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px;">
  <h2 style="color: #333;">Hi ${name}, 👋</h2>
  <p style="font-size: 16px; color: #555;">
    Thanks for signing up for <strong style="color: #000;">TrackBOOK</strong>! 📚
  </p>
  <p style="font-size: 16px; color: #555;">
    We're thrilled to have you join our community of readers and book lovers.
    TrackBOOK helps you manage your reading goals, track your progress, and discover new reads — all in one place.
  </p>
  <p style="font-size: 16px; color: #555;">
    To get started, log in to your dashboard and start exploring. We’ve made sure it’s as easy and fun as reading a great book.
  </p>

  <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

  <p style="font-size: 14px; color: #999; text-align: center;">
    This is an automated message from <strong>TrackBOOK</strong>. Please do not reply.
  </p>
</div>

    `,
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Email error:", error);
    } else {
      console.log("Email sent successfully");
    }
  });
}

module.exports = {sendWelcomeEmail}

