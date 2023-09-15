//      **  reset password controller    **      //

// import required modules
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const {resetPasswordMail} = require('../mailTemplates/ResetPasswordMail')



exports.createResetToken = async(req, res) => {
    try{
        // fetch email and check valid user or not
        const email = req.body.email;
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(401).json({
				success: false,
				message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
			});
		}

        // create token and add it to user's document
        const token = crypto.randomBytes(20).toString('hex')

        const updatedUser = await User.findOneAndUpdate(
            {email: email},
            {
                resetToken: token,
                tokenExpire: Date.now() + 5*60*1000
            },
            {new: true}
        ) 

        // create link and sent it to user
        let url = `http://reset-password/${token}`

        await mailSender(
            email,
            "Password reset mail",
            resetPasswordMail(url, `${user.firstName} ${user.lastName}`)
            )

        res.status(200).json({
			success: true,
            token: token,
			message:
				"Email Sent Successfully, Please Check Your Email to Continue Further",
		});

    } catch(error){
        console.log(error.message)
        return res.status(500).json({
			success: false,
			message: `Some Error in Sending the Reset Message`,
		});
    }
}


exports.resetPassword = async(req, res) => {
    try{
        // fetch token, new password
        const {password, confirmPassword, token} = req.body

        // match passwords
        if (confirmPassword !== password) {
			return res.status(401).json({
				success: false,
				message: "Password and Confirm Password Does not Match",
			});
		}

        // search for token
        const userDetails = await User.findOne({resetToken: token})
        if (!userDetails) {
			return res.status(401).json({
				success: false,
				message: "Token is Invalid",
			});
		}

        // if token time execced
        if(!(userDetails.tokenExpire > Date.now())){
            return res.status(403).json({
				success: false,
				message: `Token is Expired, Please Regenerate Your Token`,
			});
        }

        let hashedPassword = await bcrypt.hash(password, 10)

        // update on db
        await User.findOneAndUpdate(
            {resetToken: token},
            {password: hashedPassword},
            {new: true}
        )

        return res.status(200).json({
			success: true,
			message: `Password Reset Successful`,
		});



    } catch(error){
        return res.status(500).json({
			success: false,
			message: `Some Error in updating password`,
		});
    }
}



