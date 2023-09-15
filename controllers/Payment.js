//      **  payment related controller    **      //


// import required modules
require('dotenv').config()
const crypto = require("crypto")
const {instance} = require('../config/Razorpay')
const Students = require('../models/FinalYearStudents')
const mailSender = require('../utils/mailSender');





exports.createOrder = async(req, res)=>{
    try{
        const {email, amount} = req.body

        // check if already ctc registerd
        const flag = await Students.findOne({email})
        if(flag){
            return res.json({
                success: false,
                message: 'This mail is Already CTC Registerd'
            })
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            notes: {
                email: email
            }
        }

   
        // Initiate the payment using Razorpay
        const paymentResponse = await instance.orders.create(options)
        res.json({
            success: true,
            data: paymentResponse,
        })

    } catch(error){
        res.status(500).json({
            success: false,
            message: "Could not initiate order." 
        })
    }
}

exports.verifyPayment = async(req, res)=>{
    try{
        const {razorpay_payment_id, razorpay_order_id, razorpay_signature, email} = req.body

        let body = razorpay_order_id + "|" + razorpay_payment_id

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
            .update(body.toString())
            .digest("hex")

        if (expectedSignature === razorpay_signature) {
            await Students.create({email})
            await mailSender(
                email,
                "CTC Registration Successfull Email",
                `Congrats, ${email} is resgistered go for signup`
            )
        } else{
            return res.json({
                success: false,
                message: "Payment failed"
            })
        }

    } catch(error){
        res.json({
            success: false,
            message: error.message
        })
    }
}

exports.sendEmail = async(req, res)=>{
    try{
        const {razorpay_payment_id, razorpay_order_id, email} = req.body

        await mailSender(
            email,
            "Razorpay payment confirmation",
            `p_id: ${razorpay_payment_id}, o_id: ${razorpay_order_id} done seens`
        )

        res.status(200).json({
            success: true
        })
    } catch(error){
        res.json({
            success: false,
            message: "payment success email not send"
        })
    }
}