//      **  profile related controller    **      //

// import required modules
const User = require('../models/User')
const Profile = require('../models/Profile')
const { imageUpload } = require('../utils/imageUploader')


// load env data into process obj
require('dotenv').config()


exports.updateProfile = async(req, res) => {
    try{
        // fetch profile data to be insert
        const {gender, dateOfBirth, about, contactNumber, city, state} = req.body
        const id = req.user.id

        // find that user using this id
        const userDetails = await User.findById(id)
        let profileDetails = await Profile.findById(userDetails.profile)

        profileDetails.gender = gender
        profileDetails.dateOfBirth = dateOfBirth
        profileDetails.about = about
        profileDetails.contactNumber = contactNumber
        profileDetails.city = city
        profileDetails.state = state

        // save the document
        await profileDetails.save()

        return res.status(200).json({
			success: true,
			message: "Profile updated successfully",
			profileDetails,
		});

    } catch(error){
        return res.status(500).json({
			success: false,
			message: error.message,
		});
    }
}


exports.deleteProfile = async(req, res) => {
    try{
        // find user details
        const id = req.user.id

        const userDetails = await User.findById(id)

        // Delete Assosiated Profile with the User
        await Profile.findByIdAndDelete(userDetails.profile)

        // now delete the user
        await User.findByIdAndDelete(id)

        res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});


    } catch(error){
        return res.status(500).json({
			success: false,
			message: error.message,
		});
    }
}


exports.getUserDetails = async(req, res) => {
    try{
        // find by id
        const id = req.user.id
        let userDetails = await User.findById(id).populate('profile').exec()

        res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});

    } catch(error){
        return res.status(500).json({
			success: false,
			message: "Error occur while fetching user details",
		});
    }
}



exports.getAppliedJobs = async(req, res) => {
    try{
        // find by id
        const id = req.user.id
        let userDetails = await User.findById(id).populate('jobs').exec()

        res.status(200).json({
			success: true,
			message: `All applied jobs by ${userDetails.firstName} ${userDetails.lastName}`,
			jobs: userDetails.jobs,
		});

    } catch(error){
        return res.status(500).json({
			success: false,
			message: "Error occur while fetching applied jobs",
		});
    }
}


exports.updateProfilePicture = async(req, res) => {
    try{
        // get the image
        const image = req.files.profilePicture
        // find by id
        const id = req.user.id

        const responce = await imageUpload(image, process.env.PICTURE_FOLDER)

        // update it on user document
        await User.findByIdAndUpdate(
            id,
            {
                image: responce.secure_url
            }
        )

        res.send({
            success: true,
            message: `Image Updated successfully`,
        })

    } catch(error){
        return res.status(500).json({
			success: false,
			message: "Error occur while updating user's profile picture",
		});
    }
}