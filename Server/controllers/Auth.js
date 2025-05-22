const Otp = require("../models/Otp");
const User = require("../models/User");
const Profile = require("../models/Profile");
const OTPGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const  {mailSender}  = require("../utils/mailSender");
const {passwordUpdated} = require("../mails/templates/passwordUpdate");
require('dotenv').config();




// send otp
exports.sendOTP = async (req , res)=>{

  try{

    // extract email from req body
    const {email} = req.body;

    // verify the user already exist or not;
    const checkUserPresent = await User.findOne({email});
    if(checkUserPresent)
    {
      return res.status(401).json({
        success : false,
        message : "User Already Exist"
      });
    }

    // otp generate
    var otp = OTPGenerator.generate(6,{
      lowerCaseAlphabets : false,
      upperCaseAlphabets : false,
      specialChars : false,
    });


    // check for unique otp and generate new otp until new found
    let result = await Otp.findOne({otp:otp});
    while(result)
    {
      otp = OTPGenerator.generate(6,{
        upperCaseAlphabets : false,
        specialChars : false,
      });
      result = await Otp.findOne({otp:otp});
    }

    console.log("OTP generated :- ",otp);

    const otpPayload = {email , otp};

    // create entry for otp
    const otpBody = await Otp.create(otpPayload);
    console.log(otpBody);
    
    res.status(200).json({
      success : true,
      message :"Otp generate successfully",
      otp,
    });

    

  }catch(error)
  {
    console.log("Error occur while generating OTP");
    console.log(error);
    res.status(500).json({
      success : false,
      message :"Error occur while generating OTP",
    });

  }
};




// signup

exports.signUp = async (req,res)=>{
  try{


    // data fetch
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;



    // validate data
    if(!firstName || !lastName || !email || !password || !confirmPassword|| !otp)
    {
      return res.status(403).json({
        success : false,
        message :"All Fields are required",
      });
    }

    if(password !==confirmPassword)
    {
      return res.status(400).json({
        success : false,
        message :"Password not matched",
      });
    }

    const checkExistingUser = await User.findOne({email});
    if(checkExistingUser){
      return res.status(400).json({
        success : false,
        message :"User Already exist with this email",
      });
    }


    // find most recent otp
    const recentOtp = await Otp.findOne({email}).sort({createdAt : -1}).limit(1);
    console.log("recent otp :- ", recentOtp);
    console.log(recentOtp);
    
    // validate otp
    if(recentOtp.length === 0)
    {
      return res.status(400).json({
        success : false,
        message :" OTP not found ",
      });
    }
    else if( recentOtp.otp !== otp)
    {
      return res.status(400).json({
        success : false,
        message :" Invalid OTP ",
      });
    }


    // hash password
    const hashPassword = await bcrypt.hash(password ,10);


    // entry created in DB
    const profileDetail = await Profile.create({
      gender:null,
      dateOfBirth : null,
      about : null,
      contactNumber : null,
    });


    const user = await User.create({
      firstName,
      lastName,
      email,
      accountType,
      password : hashPassword,
      additionalDetails:profileDetail._id,
      image : `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
    });

    return res.status(200).json({
      success : true,
      message :" user entry created successfully ",
      user,
    });


  }
  catch(error)
  {
    console.log("Error occur while signing up");
    console.log(error);
    res.status(500).json({
      success : false,
      message :"Error occur while signing up",
    });
  }
}


// login

exports.login = async (req,res)=>{
  try{

    // fetch body
    const {email , password} = req.body;

    // validate data
    if(!email || !password)
    {
      return res.status(403).json({
        success : false,
        message :"All Fields are required",
      });
    }


    // check user exist or not
    const user = await User.findOne({email})
    .populate("additionalDetails");

    if(!user){
      return res.status(400).json({
        success : false,
        message :"User not exist with this email",
      });
    }



    // match password and generate jwt token
    if( await bcrypt.compare(password , user.password ))
    {
      const payload ={
        email:user.email,
        id : user._id,
        accountType : user.accountType,
      }
      const token = jwt.sign(payload , process.env.JWT_SECRET, {
        expiresIn :"24h",
      })

      // insert in the user
      user.token = token;
      // this password not removed in db , only remove from the api
      user.password = undefined;
      
      const options = {
        expires : new Date(Date.now()+ 3*24*60*60*1000),
        httpOnly : true,
      }
      res.cookie("token" , token,options).status(200).json({
        success : true,
        token,
        user,
        message : "Logged in successfully",
      });

    }
    else{
      res.status(400).json({
        success : false,
        message :"wrong password",
      });
    }
    

  }catch(error)
  {
    console.log("Error occur while login ");
    console.log(error);
    res.status(500).json({
      success : false,
      message :"Error occur while login ",
    });
  }
}


// change password

exports.changePassword = async(req , res)=>{
  try{
    // get data :- oldPassword , newPassword , confirmPassword

    const {oldPassword, newPassword} = req.body;

    const userDetails = await User.findById(req.user.id);

    // validation,
    if(!oldPassword|| !newPassword )
    {
      return res.status(403).json({
        success : false,
        message :"All Fields are required",
      });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword , userDetails.password);
    if(!isPasswordMatch)
    {
      res.status(400).json({
        success : false,
        message :" first ,correctly typed old password",
      });
    }

    if(newPassword !== confirmNewPassword)
    {
      res.status(400).json({
        success : false,
        message :" password not matched",
      });
    };

    
    // update password in db
    const hashPassword = await bcrypt.hash(newPassword ,10);
    const updatedUserDetails = await User.findByIdAndUpdate(req.user.id, {password : hashPassword}, {new : true});

    // Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

    // response
    return res.status(200).json({
      success : true,
      message :" password updated successfully ",
    });

  }
  catch(error)
  {
    console.log("Error occur while changing Password ");
    console.log(error);
    res.status(500).json({
      success : false,
      message :"Error occur while changing Password ",
    });
  }
}