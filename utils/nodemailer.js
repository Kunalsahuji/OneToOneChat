const nodemailer = require("nodemailer");
const { EMAIL_ID, PASS, ADDRESS } = process.env
console.log(EMAIL_ID, PASS, ADDRESS)


const sendmail = async (user, resetUrl) => {
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
      to: user.email,
      from: ADDRESS,
      subject: "Password Reset Request",
      text: "Do not share this link to anyone",
      html: `<p>You requested a password reset. Click <a href='${resetUrl}'>here</a> to reset your password.</p>`
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) console.log(error);

      user.resetPasswordToken = 1
      console.log("Email sent:", info);
      await user.save();
      // res.send(`<h1 style="text-align:center; margin-top: 20px; color: tomato;">Check Inbox/Spam Reset password link has been sent to your email.</h1>`)

    })

  } catch (error) {
    console.log(error)
  }
}


module.exports = sendmail;
