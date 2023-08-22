//   **   creating otp model   **  //

const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

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

// create a pre hook for mail send
otpSchema.pre("save", async function(next){
    try{
        const response = await mailSender(
            email,
            "Verification Email from PlacementDecision",
            otp
        )
        console.log("mail response", response)
        next()
    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Error while sending verification mail."
        })
    }
})

// export model after model creation
module.exports = mongoose.model('OTP', otpSchema)