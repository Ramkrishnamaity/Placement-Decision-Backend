//      **  signup, login, sendotp, change password controller    **      //

// import required modules
const Students = require('../models/FinalYearStudents')
const User = require('../models/User')
const OTP = require('../models/OTP')
const Profile = require('../models/Profile')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')
const {passwordUpdated} = require('../mailTemplates/PasswordChangeMail')
const mailSender = require('../utils/mailSender')

// load env data into process obj
require('dotenv').config()



exports.signup = async(req, res) => {
    try{
        // destructure fields from the request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
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
            dept: null,
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
            password: hashedPassword,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
            profile: profileDetails._id
        })

        // before send successful responce with user, remove the password from user obj
        user.password = undefined

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
        })

    } catch(error){
        return res.status(500).json({
			success: false,
			message: `User cannot be registered. Please try again.`,
		});
    }
}


exports.login = async(req, res) => {
    try{
        // Get email and password from request body
        const {email, password} = req.body

        // check if any details is null
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "All Fields are required."
            })
        }

        // check if user exist or not
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not registered. Please sign up to continue."
            })
        }

        // compare password
        if( await bcrypt.compare(password, user.password) ){

            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            }

            const tokenOptions = {
                expiresIn: "72h",
            }
            // create jwt token
            const token = jwt.sign(payload, process.env.JWT_SECRET, tokenOptions )

            user.token = token
            user.password = undefined

            const cookieOptions = {
                expires: new Date(Date.now() +  3 * 24 * 60 * 60 * 1000),
                httpOnly: true 
            }
            // create a cookie
            res.cookie("token", token, cookieOptions).status(200).json({
				success: true,
				message: `User Login Successfully`,
			});


        } else{
            return res.status(401).json({
                success: false,
                message: "Password is incorrect."
            })
        }



    } catch(error){
        console.log(error.message)     
        return res.status(500).json({
			success: false,
			message: `Login Failure Please Try Again`,
		});
    }
}



exports.sendotp = async(req, res) => {
    try{
        // fetch the email
        const {email} = req.body

        // only this institute students can signup
        const flag = await Students.findOne({email: email})
        if(!flag){
            return res.status(400).json({
                success: false,
                message: "Only GMIT Students can signup."
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

        // otp generate
        const otp = otpGenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        await OTP.create({email, otp})

        res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		});


    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


exports.changePassword = async(req, res) => {
    try{
        // fetch user details
        const userDetails = await User.findById(req.user.id)

        const {oldPassword, newPassword, confirmNewPassword} = req.body


        // Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
        
        // match user's password 
        if(!isPasswordMatch){
            return res.status(401).json({
                success: false,
                message: "Password is incorrect."
            })
        }

        // match new passwords
        if(newPassword !== confirmNewPassword){
            return res.status(401).json({
                success: false,
                message: "The password and confirm password does not match."
            })
        }

        const encryptedPassword = await bcrypt.hash(newPassword, 10);
		
        await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

        // send a notification mail
        try{
            const response = await mailSender( 
                userDetails.email,
                "Notification Email from PlacementDecision",
                passwordUpdated(userDetails.email, userDetails.firstName)
            )
        } catch(error){
            return res.status(500).json({
                success: true,
                message: "Error occur while sending notification mail."
            })
        }

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })


    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Error occur while updating password."
        })
    }
}

