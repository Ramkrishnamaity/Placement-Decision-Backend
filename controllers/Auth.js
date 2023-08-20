//      **  signup, login, sendotp controller    **      //

// import required modules
const User = require('../models/User')
const OTP = require('../models/OTP')
const Profile = require('../models/Profile')
const bcrypt = require('bcrypt')



exports.signup = async(req, res) => {
    try{
        // destructure fields from the request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp
        } = req.body;

        // check if any details is null
        if(
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword ||
            !otp
        ){
            return res.status(403).json({
                success: false,
                message: "All Fields are required."
            })
        }

        // check if password and confirm password did not match
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match. Please try again."
            })
        }

        // check if user already exists
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue."
            })
        }

        // validate otp

        // Find the most recent OTP for the email
        const response = await OTP.find({email}).sort({createdAt: -1}).limit(1)   // ???
        if(response.length === 0 || otp !== response[0].otp){
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            })
        }

        // secure the password
        const hashedPassword = await bcrypt.hash(password, 10)


        // create profile for the user
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
            city: null,
            state: null,
        })

        // create user
        let user = await User.create({
            firstName,
            lastName,
            email,
            password,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
            profile: profileDetails._id
        })

        // before send successful responce with user, remove the password from user obj
        user.password = undefined

        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
        })

    } catch(error){
        return res.status(500).json({
			success: false,
			message: `due to: ${error.message} , User cannot be registered. Please try again.`,
		});
    }
}


exports.login = async(req, res) => {
    try{

    } catch(error){

    }
}



exports.sendotp = async(req, res) => {
    try{

    } catch(error){
        
    }
}
