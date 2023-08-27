//      **  students details related routes  **       //

const express = require('express')
const router = express.Router()

// import all required controllers and middlewares
const {auth, isAdmin} = require('../middlewares/AuthZ')
const {getAllStudents, addStudent, deleteStudent} = require('../controllers/Students')


// map these with related routes

router.get('/getAllStudents', auth, isAdmin,  getAllStudents)

router.post('/addStudent', auth, isAdmin, addStudent)

router.delete('/deleteStudent', auth, isAdmin, deleteStudent)


// export router for use in main application
module.exports = router