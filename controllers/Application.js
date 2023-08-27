//      **  job related controller    **      //


// import required modules
const User = require('../models/User')
const Job = require('../models/Job')
const Application = require('../models/Application')
const { imageUpload } = require('../utils/imageUploader')
const {jobApplyEmail} = require('../mailTemplates/JobApplyMail')
const mailSender = require('../utils/mailSender')


exports.createApplication = async(req, res) => {
    try{
        // get id and fetch the application details
        const uid = req.user.id
        const {
            jobId,
            name,
            email,
            rollNo,
            regNo,
            semester,
            year,
            cgpa,
            secondary,
            higher,
        } = req.body
        const resume = req.files?.resume



        // if there was a unfilled value
        if(
            !jobId ||
            !name ||
            !email ||
            !rollNo ||
            !regNo ||
            !semester ||
            !year ||
            !cgpa ||
            !secondary ||
            !higher || 
            !resume
        ){
            return res.status(401).json({
                success: false,
                message: "All fields are required."
            })
        }

        // check if user already apply
        const isApply = await Application.findOne({uid: uid, jobId: jobId})
        if(isApply){
            return res.status(400).json({
                success: false,
                message: "User already applied"
            })
        }

        // upload the resume into cloudinary
        const image = await imageUpload(resume, process.env.RESUME_FOLDER)

        // create application document 
        const responce = await Application.create({
            jobId,
            uid,
            name,
            email,
            rollNo,
            regNo,
            semester,
            year,
            cgpa,
            secondary,
            higher,
            resume: image.secure_url,
        })

        // update on job document
        const job = await Job.findByIdAndUpdate(jobId, {$push : {applications: responce._id}}, {new: true})

        // update applied jobs array of user
        const user = await User.findByIdAndUpdate(uid, {$push: {jobs: job._id}}, {new: true})

        console.log()
        // send a notification mail
        try{
            const response = await mailSender(
                user.email,
                "Notification Email from PlacementDecision",
                jobApplyEmail(job.companyName, user.firstName)
            )
        } catch(error){
            return res.status(500).json({
                success: false,
                message: "Error occur while sending notification mail."
            })
        }

        return res.status(200).json({
            success: true,
            message: "Job Application created successfully",
        })

    } catch(error){
        return res.status(500).json({
			success: false,
            error: error.message,
			message: `job application cannot created, Please try again later.`,
		});
    }
}

exports.getAllApplications = async(req, res) => {
    try{
        // get job id 
        const {jobId} = req.body

        // fetch job applications
        const jobDetails = await Job.findById(jobId).populate('applications').exec()

        res.status(200).json({
            success: true,
            message: "Job applications",
            data: jobDetails.applications
        })

    } catch(error){
        return res.status(500).json({
			success: false,
			message: `due to: ${error.message} , job applications cannot retrive, Please try again later.`,
		});
    }
}
