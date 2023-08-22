//   **   creating User model   **  //

const mongoose = require('mongoose')

// define schema for user model
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        accountType: {
            type: String,
            enum: ["Admin","Student"],
            default: 'student',
            required: true,
        },
        image: {
            type: String,
            required: true, 
        },
        profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile"
        },
        resetToken: {
            type: String,
        },
        tokenExpire: {
            type: Date,
        },
        appliedJob: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Job"
            }
        ]
    }, {timestamps: true}
)

// export model after model creation
module.exports = mongoose.model('User', userSchema) 
