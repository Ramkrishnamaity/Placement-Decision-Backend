//      **  authentication related routes  **       //

const express = require('express')
const router = express.Router()

// import all required controllers and middlewares
const {login, signup, sendotp, changePassword} = require('../controllers/Auth')
const { createResetToken, resetPassword } = require('../controllers/ResetPassword')


// map these with related routes
router.post('/login', login)

router.post('/signup', signup)

router.post('/sendotp', sendotp)

router.put('/changePassword', changePassword)

router.post('/createResetToken', createResetToken)

router.put('/resetPassword', resetPassword)



// export router for use in main application
module.exports = router