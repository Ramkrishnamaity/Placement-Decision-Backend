//       **    mail send using nodemailer      **      //


const {transporter} = require('../config/MailSender')

const mailSender = async(email, title, body)=>{
    try{
        const response = await transporter.sendMail({
            from: "PlacementDecision CDC || John Doe",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`     
        })
        return response

    } catch(error){
        console.log(error.message)
    }
}

module.exports = mailSender