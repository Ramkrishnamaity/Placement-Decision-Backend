//      **  Student related controller    **      //

// import required modules
const Students = require('../models/FinalYearStudents')


exports.getAllStudents = async(req, res) => {
    try{
        // fetch all Student
        const students = await Students.find({})

        return res.status(200).json({
            success: true,
            message: "data fetched successfully",
            students,
        })

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Error occur while fetch student data"
        }) 
    }
}

exports.addStudent = async(req, res) => {
    try{
        // get email
        const {email} = req.body
        await Students.create({email})

        return res.status(200).json({
            success: true,
            message: "student added"
        })

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Error occur while add student"
        }) 
    }
}

exports.deleteStudent = async(req, res) => {
    try{
        // get email
        const {email} = req.body
        await Students.findOneAndDelete({email: email})

        return res.status(200).json({
            success: true,
            message: "student deleted"
        })

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Error occur while delete student"
        }) 
    }
}