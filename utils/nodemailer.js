const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../models/userModel");
const { EMAIL_ID, PASS, ADDRESS } = process.env

const sendmail = async (email, resetUrl) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: EMAIL_ID,
        pass: PASS,
      },
    });

    const mailOptions = {
      to: email,
      from: ADDRESS,
      subject: "Password Reset Request",
      text: "Do not share this link to anyone",
      html: `<p>You requested a password reset. Click <a href='${resetUrl}'>here</a> to reset your password.</p>`
    };

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) res.send(error);
      else console.log("Email sent:", info.response);
      // user.resetPasswordToken = 1
      // await user.save();
      // res.send(`<h1 style="text-align:center; margin-top: 20px; color: tomato;">Check Inbox/Spam</h1>`)
    })
  } catch (error) {
    console.log(error)
    res.send(error);
  }
}


module.exports = sendmail;
