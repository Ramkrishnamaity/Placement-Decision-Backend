//      **       auth, is admin, is student       **      //

// import required modules
const jwt = require('jsonwebtoken')


// load env data into process obj
require('dotenv').config()


exports.auth = async(req, res, next) => {
    try{
        // extract token request cookies
        const token = req.cookies.token

        //if token missing, then return response
        if(!token) {
            return res.status(401).json({
                success:false,
                message:'Token is missing',
            });
        }

        // verify token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decode
        } catch(error){
            return res.status(401).json({
                success:false,
                message:'Token is invalid',
            });
        }

        
        next()

    } catch(error){
        return res.status(500).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}

exports.isAdmin = async(req, res, next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Admin only',
            });
        }
        
        next()
    } catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again'
        })
    }
}


exports.isStudent = async(req, res, next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Students only',
            });
        }
        
        next()
    } catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again'
        })
    }
}
