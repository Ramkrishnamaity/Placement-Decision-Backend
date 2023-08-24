// server creation
const express = require('express')
const app = express()

// load env data into process obj
require('dotenv').config()
const PORT = process.env.PORT || 5000

// fetch required modules
const connectDB = require('./config/Database')
const {cloudConnect} = require('./config/Cloudinary')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const userRoutes = require('./routes/User')
const profileRoutes = require('./routes/Profile')
const jobRoutes = require('./routes/Job')
const applicationRoutes = require('./routes/Application')

// db conection & cloudinary connection
connectDB()
cloudConnect()

// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp"
    })
)

// routes
app.use('/api/v1/auth', userRoutes)
app.use('/api/v1/profile', profileRoutes)
app.use('/api/v1/job', jobRoutes)
app.use('/api/v1/application', applicationRoutes)

// default route
app.get('/', (req, res)=>{
    res.json({
        success: true,
        message: "Your server is successfully started"
    })
})

// lets live the server
app.listen(PORT, ()=>{
    console.log(`App is running at ${PORT}`)
})