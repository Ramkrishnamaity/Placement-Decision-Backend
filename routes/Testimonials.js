//      **  well students related routes  **       //

const express = require('express')
const router = express.Router()

// import all required controllers and middlewares
const {auth, isAdmin} = require('../middlewares/AuthZ')
const {getAllTesti, addTesti, deleteTesti} = require('../controllers/Testimonials')


// map these with related routes

router.get('/getAllTesti', auth, getAllTesti)

router.post('/addTesti', auth, isAdmin, addTesti)

router.delete('/deleteTesti', auth, isAdmin, deleteTesti)


// export router for use in main application
module.exports = router