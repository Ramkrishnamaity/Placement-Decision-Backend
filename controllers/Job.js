//      **  job related controller    **      //

// import required modules
const User = require('../models/User')
const Job = require('../models/Job')
const Application = require('../models/Application')
const { imageUpload } = require('../utils/imageUploader')


exports.createJob = async(req, res) => {
    try{
        // fetch job data
        const {
            category,
            companyName,
            jobType,
            description,
            tags,
            location,
            package,
            vacancie,
            lastDate

        } = req.body
        const logo = req.files.companyLogo

        // if there was a unfilled value
        if(
            !category ||
            !companyName ||
            !jobType ||
            !description ||
            !tags ||
            !location ||
            !package ||
            !vacancie ||
            !lastDate ||
            !logo
        ){
            return res.status(401).json({
                success: false,
                message: "All fields are required."
            })
        }

        // upload the company logo into cloudinary
        const responce = await imageUpload(logo, process.env.LOGO_FOLDER)

        // create job document 
        await Job.create(
            {
                category,
                companyName,
                logo: responce.secure_url,
                jobType,
                description,
                tags,
                location,
                package,
                vacancie,
                lastDate,
            }
        )

        // send mail

        return res.status(200).json({
            success: true,
            message: "Job created successfully",
        })

    } catch(error){
        return res.status(500).json({
			success: false,
			message: `due to: ${error.message} , job cannot created, Please try again.`,
		});
    }
}

exports.updateJob = async(req, res) => {
    try{
        // fetch job data
        const {
            jobId,
            category,
            companyName,
            jobType,
            description,
            tags,
            location,
            package,
            vacancie,
            lastDate

        } = req.body
        const logo = req.files.companyLogo
        const jobDetails = await Job.findById(jobId)

        // if there was a unfilled value
        if(
            !jobId ||
            !category ||
            !companyName ||
            !jobType ||
            !description ||
            !tags ||
            !location ||
            !package ||
            !vacancie ||
            !lastDate ||
            !logo
        ){
            return res.status(401).json({
                success: false,
                message: "All fields are required."
            })
        }

        // upload the company logo into cloudinary
        const responce = await imageUpload(logo, process.env.LOGO_FOLDER)

        jobDetails.category = category
        jobDetails.companyName = companyName
        jobDetails.jobType = jobType,
        jobDetails.description = description
        jobDetails.tags = tags
        jobDetails.location = location
        jobDetails.package = package
        jobDetails.vacancie = vacancie
        jobDetails.lastDate = lastDate
        jobDetails.logo = responce.secure_url
        

        // save the document
        await jobDetails.save()

        return res.status(200).json({
			success: true,
			message: "Job updated successfully",
		});

    } catch(error){
        return res.status(500).json({
			success: false,
			message: error.message,
		});
    }
}

exports.getJobs = async(req, res) => {
    try{
        let jobs = await Job.find({})

        res.status(200).json({
			success: true,
			message: `All jobs are listed`,
			jobs,
		});

    } catch(error){
        return res.status(500).json({
			success: false,
			message: "Error occur while fetching job list",
		});
    }
}



exports.deleteJob = async(req, res) => {
    try{
        // fetch job id
        const jobId = req.body
        // const jobDeatils = await Job.findById(jobId)


        // Delete Assosiated  applications and appliedjob section of user  ?? with the job
        await Application.deleteMany({jobId: jobId})

        await User.updateMany(
            {jobs: jobId},
            {$pull: {jobId}}
        )

        // now delete the job
        await Job.findByIdAndDelete(id)

        res.status(200).json({
			success: true,
			message: "Job deleted successfully",
		});


    } catch(error){
        return res.status(500).json({
			success: false,
			message: "Error occur while deleting job",
		});
    }
}

