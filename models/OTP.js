//   **   creating otp model   **  //

const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const otpTemplate = require('../mailTemplates/EmailVerificationMail')

// define schema for otp model
const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 60 * 5  // document will be deleted after 5 minutes of its creation.
        }
    }
)
// Define a function to send emails
async function sendVerificationEmail(email, otp) {
    try {
        await mailSender(
            email,
            "Verification Email from PlacementDecision",
            otpTemplate(otp)
        )
    } catch (error) {
      throw error
    }
}


// create a pre hook for mail send
otpSchema.pre("save", async function (next) {
    // Only send an email when a new document is created
    if (this.isNew) {
      await sendVerificationEmail(this.email, this.otp);
    }
    next();
});


// export model after model creation
module.exports = mongoose.model('OTP', otpSchema)