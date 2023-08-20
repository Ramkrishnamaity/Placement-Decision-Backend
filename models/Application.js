//   **   creating application model   **  //

const mongoose = require('mongoose')

// define schema for application model
const applicationSchema = new mongoose.Schema(
    {
        jobId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        name:{
            type: String,
            trim: true,
            required: true,
        },
        email:{
            type: String,
            trim: true,
            required: true,
        },
        rollNo:{
            type: Number,
            required: true,
        },
        regNo:{
            type: Number,
            required: true,
        },
        semester:{
            type: Number,
            required: true,
        },
        year:{
            type: Number,
            required: true,
        },
        cgpa:{
            type: Number,
            required: true,
        },
        secondary :{
            type: Number,
            required: true,
        },
        higher :{
            type: Number,
            required: true,
        },
        resume: {
            type: String,
            required: true,
        }
    }, {timestamps: true}
)

// export model after model creation
module.exports = mongoose.model('Application', applicationSchema)