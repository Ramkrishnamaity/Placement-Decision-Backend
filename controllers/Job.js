//      **  job related controller    **      //

// import required modules
const User = require('../models/User')
const Job = require('../models/Job')
const Application = require('../models/Application')
const customCron = require('../cron')


exports.createJob = async(req, res) => {
    try{
        // fetch job data
        const {
            category,
            companyUrl,
            companyName,
            jobType,
            description,
            tags,
            location,
            package,
            vacancie,
            lastDate

        } = req.body

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
            !companyUrl
        ){
            return res.status(401).json({
                success: false,
                message: "All fields are required."
            })
        }

        // upload the company logo into cloudinary

        const logo = `https://logo.clearbit.com/${companyUrl}`

        // separate tags
        const skills = tags.split(" ")

        // create job document 
        const jobD = await Job.create(
            {
                category,
                companyName,
                logo,
                jobType,
                description,
                tags: skills,
                location,
                package,
                vacancie,
                lastDate,
            }
        )

        // send mail
        // customCron.sendMailToAllUser()

        return res.status(200).json({
            success: true,
            message: "Job created successfully",
            jobD
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

        // separate tags
        const skills = tags.split(" ")


        const jobDetails = await Job.findById(jobId)

        if(category) jobDetails.category = category
        if(companyName) jobDetails.companyName = companyName
        if(jobType) jobDetails.jobType = jobType
        if(description) jobDetails.description = description
        if(tags) jobDetails.tags = skills
        if(location) jobDetails.location = location
        if(package) jobDetails.package = package
        if(vacancie) jobDetails.vacancie = vacancie
        if(lastDate) jobDetails.lastDate = lastDate
        

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

exports.getJob = async(req, res) => {
    try{
        const {jobId} = req.body
        const job = await Job.findById(jobId).populate('applications').exec()

        const relatedJob = await Job.find({category: job.category}).limit(4)

        // Object.values(relatedJob).forEach((r, i)=>{
        //     if(r._id === job._id){
        //         relatedJob.splice(i,1)
        //     }
        // })

        res.status(200).json({
			success: true,
			message: `job fetch successfully`,
			job,
            relatedJob
		});

    } catch(error){
        return res.status(500).json({
			success: false,
			message: "Error occur while fetching job list",
		});
    }
}


exports.getJobs = async(req, res) => {
    try{

        const {category, tags, jobType} = req.query
        let queryObject = {}

        if(category) queryObject.category = category
        if(jobType) queryObject.jobType = jobType
        if(tags) queryObject.tags = {$regex: tags, $options: 'i'}

        let jobs = await Job.find(queryObject)

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

exports.getLatestJobs = async(req, res) => {
    try{
        let jobs = await Job.find({}).sort({createdAt: -1}).limit(3)

        res.status(200).json({
			success: true,
			message: `All jobs are listed`,
			jobs,
		});

    } catch(error){
        return res.status(500).json({
			success: false,
			message: "Error occur while fetching recent jobs",
		});
    }
}


exports.deleteJob = async(req, res) => {
    try{
        // fetch job id
        const {id} = req.body

        // job existance
        const isExist = await Job.findById(id)
        if(!isExist){
            return res.status(401).json({
                success: false,
                message: "Job does't exist."
            }) 
        }

        // Delete Assosiated  applications and appliedjob section of user  ?? with the job
        await Application.deleteMany({jobId: id})

        await User.updateMany(
            {jobs: id},
            {$pull: {jobs: id}}
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
            error: error.message,
			message: "Error occur while deleting job",
		});
    }
}

