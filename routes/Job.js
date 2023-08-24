//      **  job related routes  **       //

const express = require('express')
const router = express.Router()

// import all required controllers and middlewares
const {auth, isAdmin} = require('../middlewares/AuthZ')
const { createJob, getJobs, deleteJob , updateJob} = require('../controllers/Job')



// map these with related routes

router.post('/createJob', auth, isAdmin, createJob)

router.put('/updateJob', updateJob)

router.get('/getJobs', auth, isAdmin, getJobs)

router.delete('/deleteJob', auth, isAdmin, deleteJob)


// export router for use in main application
module.exports = router