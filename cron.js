const cron = require('node-cron')
const User = require('./models/User')
const mailSender = require('./utils/mailSender')
const { jobNotificationMail } = require('./mailTemplates/JobNotificationMail')


const sendMail = async(email, job, name)=>{
    try{
        await mailSender(
            email,
            "Job Notification Mail",
            jobNotificationMail(job, name)
        )
    } catch(error){
        console.log(error)
    }
}


const sendMailToAllUser = ({job})=>{
    try{
        cron.schedule('* * * * * *', async function(){
            const users = await User.find({})

            if(users.length > 0){
               
                users.forEach(async(user)=>{
                    await sendMail(user.email, job, user.firstName)
                })
                
            }

        })
    } catch(error){
        console.log(error)
    }
}

module.exports = sendMailToAllUser