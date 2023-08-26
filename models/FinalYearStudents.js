//   **   creating FinalYearStudents model   **  //

const mongoose = require('mongoose')

// define schema for model
const studentSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            unique: true,
            required:true,
        }
    }
)

// export model after model creation
module.exports = mongoose.model("Students", studentSchema)