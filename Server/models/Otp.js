const mongoose = require("mongoose");
const {mailSender} = require("../utils/mailSender");
const emailTemplate = require("../mails/templates/emailVerificationTemplate")

const otpSchema = new mongoose.Schema({

  email:{
    type:String,
    required:true,
  },
  otp:{
    type:String,
    required:true,
  },
  createdAt:{
    type:Date,
    default:Date.now(),
    expires:60*5,
  }

});

async function sendVerificationMail(email,otp) {
  try{
    const mailResponse = await mailSender(email, "Verification Mail from StudyNotion", emailTemplate(otp));
    console.log("mail sent successfully ", mailResponse);
  }
catch(error){
  console.log("error occured while sending mail");
  console.log(error);
}
}

otpSchema.pre("save", async function(next){
  await sendVerificationMail(this.email , this.otp);
  next();
})

module.exports = mongoose.model("Otp", otpSchema);