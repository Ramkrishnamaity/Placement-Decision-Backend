//      **  authentication related routes  **       //

const express = require('express')
const router = express.Router()

// import all required controllers and middlewares
const {login, signup, sendotp} = require('../controllers/Auth')


// map these with related routes
router.post('/login', login)

router.post('/signup', signup)

router.post('/sendotp', sendotp)





// export router for use in main application
module.exports = router