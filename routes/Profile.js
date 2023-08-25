//      **  user details related routes  **       //

const express = require('express')
const router = express.Router()

// import all required controllers and middlewares
const {auth, isAdmin} = require('../middlewares/AuthZ')
const {updateProfile, deleteProfile, getUserDetails, updateProfilePicture, getUsers} = require('../controllers/Profile')



// map these with related routes

router.put('/updateProfile', auth, updateProfile)

router.delete('/deleteProfile', auth, deleteProfile)

router.get('/getUserDetails', auth, getUserDetails)

router.put('/updateProfilePicture', auth, updateProfilePicture)


//  `               *****???????
router.get('/getUsers', auth, isAdmin, getUsers)




// export router for use in main application
module.exports = router