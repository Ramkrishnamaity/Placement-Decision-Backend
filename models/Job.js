//   **   creating job model   **  //

const mongoose = require('mongoose')

// define schema for job model
const jobSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            trim: true,
        },
        logo: {
            type: String,
            required: true,
        },
        companyName: {
            type: String,
            trim: true,
        },
        jobType: {
            type: String,
            enum: ["Onsite", "Hybrid", "Remote"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        tags:{
            type: Array,
        },
        location: {
            type: String,
            trim: true,
        },
        package: {
            type: String,
            trim: true,
        },
        vacancie: {
            type: Number,
        },
        lastDate: {
            type: Date,
        },
        applications: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Application"
            }
        ]
    }, {timestamps: true}
)

// export model after model creation
module.exports = mongoose.model('Job', jobSchema)