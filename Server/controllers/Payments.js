const {instance} = require("../config/razorpay");
const User = require("../models/User");
const Course = require("../models/Course");
const {mailSender} = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mails/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const { sign } = require("jsonwebtoken");
const { errorMonitor } = require("nodemailer/lib/xoauth2");


// capture the payment and initiate the razorpay order
exports.capturePayment = async(req,res)=>{
  try{

    // get the courseId and userId
    const {course_id} = req.body;
    const userId = req.user.id;

    // validation
    if(!course_id){
      return res.status(400).json({
        success : false,
        messsage : 'please provide the valid course id',
      }); 
    }
    const course = await Course.findById(course_id);
    if(!course)
    {
      return res.status(500).json({
        success : false,
        messsage : 'could not find the course',
      });
    }

    // verify that user already buy the course
    const uid = new mongoose.Types.ObjectId(userId); // conert the userId(string) into objectId coz in        course  user stored in objectId

    if(course.studentEnrolled.includes(uid))
    {
      return res.status(400).json({
        success : false,
        messsage : 'Student already enrolled in the course',
      });
    }


    // create order
    const amount = course.price;
    const currency = "INR";


    const options = {
      amount : amount*100,
      currency,
      receipt : Math.random(Date.now()).toString(),
      notes :{
        courseId : course_id,
        userId,
      }
    };
    // in notes section we intentionally give the courseid and userid so that we find it in the verifying signature api call


    try{
      //initiate the payment using razorpay
      const paymentResponse = await instance.orders.create(options);
      console.log(paymentResponse);

      return res.status(200).json({
        success : true,
        courseName : course.courseName,
        courseDescription : course.courseDescription,
        thumbnail : course.thumbnail,
        orderId : paymentResponse.id,
        currency : paymentResponse.currency,
        amount : paymentResponse.amount,
      })
    }
    catch(error)
    {
      console.error(error);
      return res.status(500).json({
        success : false,
        messsage : 'Error while initate the order',
      });
    }


  }
  catch(error)
  {
    console.error(error);
    return res.status(500).json({
      success : false,
      messsage : 'Error while capturing the payment',
    });
  }
}



// verify signature of razorpay and server

exports.verifySignature = async(req,res)=>{
  const webHookSecret = "12345678";
  const signature = req.headers["x-razorpay-signature"];

  const shasum = crypto.createHmac("sha256",webHookSecret);
  shasum.update(JSON.stringify(req.body)); // convert the shasum object into string
  const digest = shasum.digest("hex");


  // verify the signature from the razorpay
  
  if(signature !== digest)
  {
    return res.status(500).json({
      success : false,
      messsage : 'Invalid request',
    });
  }

  console.log("Payment is authorised and completed");

  // now the problem is how to find the courseid and userid because this req come from razoorpay and razorpay  do not have data of which student pay for which course.?

  // when we create a order then in a notes section we send courseid and userid , we fetch it from there

  // fetch the course
  const {courseId , userId} = req.body.payload.payment.entity.notes;

  // after fetching the course we add the course in student course list and the add the student in that particular course
  try{
    // find the course and update the student enrolled
    const enrolledCourses = await Course.findOneAndUpdate({_id:courseId},{$push :{studentEnrolled:userId},},{new:true});

    if(!enrolledCourses)
    {
      return res.status(500).json({
        success : false,
        messsage : 'course not found',
      });
    }

    console.log(enrolledCourses);


    // find the student and update the course section

    const enrolledStudent = await User.findOneAndUpdate({_id:userId},{$push : {courses:courseId}},{new : true});

    console.log(enrolledStudent);

    // send a confirmation mail
    const emailresponse = await mailSender(enrolledStudent.email , "congratulation ", "yor are enrolled");

    return res.status(200).json({
      success : 200,
      messsage : `${enrolledStudent.firstName} ${enrolledStudent.lastName} sucessfully enrolled in ${enrolledCourses.courseName}`,
    });

  }
  catch(error)
  {
    console.error(error);
    return res.status(500).json({
      success : false,
      messsage : 'Error while enrolling the course to the student ',
    });
  }



}
