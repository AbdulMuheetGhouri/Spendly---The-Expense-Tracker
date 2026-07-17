const nodemailer = require("nodemailer");
const OTPGenerator = require("otp-generator");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

const otpGenerator = () => {
  return OTPGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    digits: true,
    specialChars: false
  });
}

const send_email = async (emailTo, otp) => {
  const html = `
  <div style="background-color: #FEF7F8; padding: 30px 15px; font-family: -apple-system, sans-serif;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 450px; background-color: #ffffff; border: 1px solid #CDD4DD; border-radius: 16px; box-shadow: 0 8px 32px rgba(34,129,154,0.12); margin: 0 auto; overflow: hidden;">

      <!-- Header -->
      <tr>
        <td style="background: linear-gradient(135deg, #90C2E7 0%, #22819A 100%); padding: 22px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; font-family: Georgia, serif;">💰 Spendly</h2>
        </td>
      </tr>

      <!-- Content -->
      <tr>
        <td style="padding: 25px 20px;">
          <h3 style="color: #1D2B33; margin: 0 0 10px 0; font-size: 16px; font-weight: 700;">Verify Your Account</h3>
          <p style="color: #4B5B63; font-size: 14px; line-height: 1.5; margin: 0 0 20px 0;">
            Thanks for signing up for Spendly. Use the One-Time Password (OTP) below to verify your email and start tracking your expenses:
          </p>

          <!-- OTP Badge -->
          <div style="background-color: #DCEEF2; border-radius: 12px; padding: 14px; text-align: center; margin-bottom: 20px;">
            <span style="font-family: monospace; font-size: 30px; font-weight: 800; color: #17606F; letter-spacing: 5px; line-height: 1;">${otp}</span>
          </div>

          <!-- Alert Note -->
          <div style="background-color: #F3DEDE; border-left: 4px solid #C15C5C; padding: 10px 12px; border-radius: 4px; margin-bottom: 20px;">
            <p style="color: #8A3F3F; font-size: 12px; font-weight: 600; margin: 0;">
              ⚠️ Valid for 5 minutes only. Do not share this code.
            </p>
          </div>

          <hr style="border: 0; border-top: 1px solid #CDD4DD; margin: 0 0 15px 0;">

          <!-- Footer -->
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
            If you did not request this, please disregard this email.
          </p>
        </td>
      </tr>

    </table>
  </div>`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emailTo,
      subject: "Your OTP Verification Code",
      html: html,
    })
  } catch (err) {

    const { ExpressError } = require("./middlewares");


    throw new ExpressError(500, err.message);
  }

}

module.exports = { transporter, send_email, otpGenerator };
