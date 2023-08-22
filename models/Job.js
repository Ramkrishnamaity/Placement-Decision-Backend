//   **   creating job model   **  //

const mongoose = require('mongoose')

// define schema for job model
const jobSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            trim: true,
            required: true,
        },
        logo: {
            type: String,
            required: true,
        },
        companyName: {
            type: String,
            trim: true,
            required: true,
        },
        jobType: {
            type: String,
            trim: true,
            required: true,
        },
        description: {
            type: String,
            trim: true,
            required: true,
        },
        tags: [
            {
                type: String,
                trim: true,
                required: true,
            }
        ],
        location: {
            type: String,
            trim: true,
            required: true,
        },
        package: {
            type: String,
            trim: true,
            required: true,
        },
        vacancie: {
            type: Number,
            required: true,
        },
        lastDate: {
            type: Date,
            required: true,
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