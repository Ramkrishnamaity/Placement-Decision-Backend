//      **  user details related routes  **       //

const express = require('express')
const router = express.Router()

// import all required controllers and middlewares
const {auth, isStudent} = require('../middlewares/AuthZ')
const {updateProfile, deleteProfile, getUserDetails, getAppliedJobs, updateProfilePicture} = require('../controllers/Profile')



// map these with related routes

router.put('/updateProfile', auth, updateProfile)

router.delete('/deleteProfile', auth, deleteProfile)

router.get('/getUserDetails', auth, getUserDetails)

router.get('/appliedJobs', auth, isStudent, getAppliedJobs)

router.put('/updateProfilePicture', auth, updateProfilePicture)





// export router for use in main application
module.exports = router