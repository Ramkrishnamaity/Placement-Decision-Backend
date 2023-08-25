//       **    mail send using nodemailer      **      //


const {transporter} = require('../config/MailSender')

const mailSender = async(email, title, body)=>{
    try{
        const response = await transporter.sendMail({
            from: "PlacementDecision CDC || GMIT",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`     
        })
        return response

    } catch(error){
        return error
    }
}

module.exports = mailSender