//      **  Student related controller    **      //

// import required modules
const Placed = require('../models/Testimonials')
const { imageUpload } = require('../utils/imageUploader')


exports.getAllTesti = async(req, res) => {
    try{
        // fetch all Student
        const Placed = await Placed.find({})

        return res.status(200).json({
            success: true,
            message: "data fetched successfully",
            Placed,
        })

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Error occur while fetch testi data"
        }) 
    }
}

exports.addTesti = async(req, res) => {
    try{
        // get data
        const {name, company, post} = req.body
        const image = req.files.file

        if(
            !name ||
            !company ||
            !post ||
            !image
        )
        {
            return res.status(401).json({
                success: false,
                message: "All fields are required."
            })
        }

        // upload image to cloudinary
        const responce = await imageUpload(image, process.env.PICTURE_FOLDER)

        await Placed.create(
            {
                name,
                image: responce.secure_url,
                company,
                post,
            }
        )

        return res.status(200).json({
            success: true,
            message: "testi added"
        })

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Error occur while add testi"
        }) 
    }
}

exports.deleteTesti = async(req, res) => {
    try{
        // get name
        const {name} = req.body
        await Placed.findOneAndDelete({name: name})

        return res.status(200).json({
            success: true,
            message: "testi deleted"
        })

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Error occur while delete testi"
        }) 
    }
}