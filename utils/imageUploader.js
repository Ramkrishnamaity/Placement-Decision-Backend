//      **      upload image to cloudinary      **      //

const cloudinary = require('cloudinary').v2

exports.imageUpload = async(file, folder, quality) => {

    let options = {folder}

    if(quality)
        options.quality = quality

    return await cloudinary.uploader.upload(file.tempFilePath, options)

}