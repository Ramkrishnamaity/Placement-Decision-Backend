//   **   creating otp model   **  //

const mongoose = require('mongoose')

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

// export model after model creation
module.exports = mongoose.model('OTP', otpSchema)