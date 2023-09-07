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
        const {gender, dateOfBirth,dept, about, contactNumber, city, state} = req.body
        const id = req.user.id

        // find that user using this id
        const userDetails = await User.findById(id)
        let profileDetails = await Profile.findById(userDetails.profile)

        if(gender) profileDetails.gender = gender
        if(dept) profileDetails.gender = dept
        if(dateOfBirth) profileDetails.dateOfBirth = dateOfBirth
        if(about) profileDetails.about = about
        if(contactNumber) profileDetails.contactNumber = contactNumber
        if(city) profileDetails.city = city
        if(state) profileDetails.state = state

        // save the document
        await profileDetails.save()

        return res.status(200).json({
			success: true,
			message: "Profile updated successfully"
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

        if(userDetails.accountType === "Admin"){
            return res.status(400).json({
                success: false,
                message: "You cannot delete your Admin profile",
            });
        }

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
        let userDetails = await User.findById(id).populate('profile').populate('jobs').exec()

        userDetails.password = undefined

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


exports.updateProfilePicture = async(req, res) => {
    try{
        // get the image
        const image = req.files.profilePicture
        // find by id
        const id = req.user.id

        const responce = await imageUpload(image, process.env.PICTURE_FOLDER)

        // update it on user document
        const user = await User.findByIdAndUpdate(
            { _id: id },
            {
                image: responce.secure_url
            },
            { new: true }
        )

        res.json({
            success: true,
            message: `Image Updated successfully`,
            user
        })

    } catch(error){
        return res.status(500).json({
			success: false,
			message: "Error occur while updating user's profile picture",
		});
    }
}


exports.getUsers = async(req, res) => {
    try{
        // fetch all users
        let users = await User.find({}).populate('profile').exec()

        users.map((user, index)=>{
            // remove admin
            if(user.accountType === "Admin"){
                users.splice(index, 1)
                return
            }
        })

        // remove passwords from data
        users.map((user) => {
            user.password = undefined,
            user.jobs = undefined
            
        })



        return res.status(200).json({
			success: true,
			message: "get users successfully",
            users,
		});


    } catch(error){
        return res.status(500).json({
			success: false,
			message: "Error occur while getting all user data",
		});
    }
}