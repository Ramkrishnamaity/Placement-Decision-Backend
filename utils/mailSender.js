//       **    mail send using nodemailer      **      //


const {transporter} = require('../config/MailSender')

const mailSender = async(email, title, body)=>{
    try{
        console.log("start")
        const response = await transporter.sendMail({
            from: "PlacementDecision CDC || GMIT",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`     
        })
        console.log("end")
        console.log(response)
        return response

    } catch(error){
        return error
    }
}

module.exports = mailSender