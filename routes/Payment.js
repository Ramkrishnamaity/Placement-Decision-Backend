//      ** payment related routes  **       //

const express = require('express')
const { isStudent, auth } = require('../middlewares/AuthZ')
const router = express.Router()

// import all required controllers and middlewares
const {createOrder, verifyPayment, sendEmail} = require('../controllers/Payment')


// map these with related routes

router.post('/createOrder', createOrder)
router.post('/verifyPayment', verifyPayment)
router.post('/sendEmail', sendEmail)


// export router for use in main application
module.exports = router