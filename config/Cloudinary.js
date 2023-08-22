//      **      cloudinary connection   **      //

const cloudinary = require('cloudinary').v2

// load env data into process obj
require('dotenv').config();


exports.cloudConnect = async()=> {
    try{

        cloudinary.config({ 
            cloud_name: process.env.CLOUD_NAME, 
            api_key: process.env.API_KEY, 
            api_secret: process.env.API_SECRET
        });  

    } catch(error) {
        console.log("Cloudnary Connection error", error.message)
    }
}