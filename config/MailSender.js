//  **  nodemailer config set   **  //

const nodemailer = require('nodemailer')
require('dotenv').config()

const configOptions = {
    host:process.env.MAIL_HOST,
    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
}

exports.transporter = nodemailer.createTransport(configOptions)
