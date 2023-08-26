//   **   creating Well Placed Students model   **  //

const mongoose = require('mongoose')

// define schema for  model
const testimonialSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        image: {
            type:String,
            required:true,
        },
        company: {
            type:String,
            required:true,
        },
        post: {
            type:String,
            required:true,
        }
    }
)

// export model after model creation
module.exports = mongoose.model("Placed", testimonialSchema)