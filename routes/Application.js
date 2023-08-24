//      **  application related routes  **       //

const express = require('express')
const router = express.Router()

// import all required controllers and middlewares
const {auth, isAdmin, isStudent} = require('../middlewares/AuthZ')
const {createApplication, getAllApplications} = require('../controllers/Application')


// map these with related routes

router.post('/createApplication', auth, isStudent, createApplication)

router.get('/getAllApplications', auth, isAdmin, getAllApplications)

// export router for use in main application
module.exports = router