//      **  authentication related routes  **       //

const express = require('express')
const router = express.Router()

// import all required controllers and middlewares
const {login, signup, sendotp, changePassword} = require('../controllers/Auth')
const { createResetToken, resetPassword } = require('../controllers/ResetPassword')
const {auth} = require('../middlewares/AuthZ')

// map these with related routes
router.post('/login', login)

router.post('/signup', signup)

router.post('/sendotp', sendotp)

router.post('/changePassword', auth, changePassword)

router.post('/createResetToken', createResetToken)

router.post('/resetPassword', resetPassword)




// export router for use in main application
module.exports = router