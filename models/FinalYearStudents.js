//   **   creating FinalYearStudents model   **  //

const mongoose = require('mongoose')

function getSession(){
    let year = new Date().getFullYear()
    return new Date(`${year}-05-28`);
}

// define schema for model
const studentSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            unique: true,
            required:true,
            expires: getSession()
        },
        
    }
)

// export model after model creation
module.exports = mongoose.model("Students", studentSchema)