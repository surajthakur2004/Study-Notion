const User = require('../models/User');
const {mailSender} = require('../utils/mailSender');
const bcrypt  = require('bcrypt');
const crypto = require('crypto');

// reset password token

exports.resetPasswordToken = async (req , res)=>{
  try{
    // fetch email from req
    const {email} = req.body;
    const user = await User.findOne({email :email});
    // validation
    if(!email)
    {
      return res.status(400).json({
        success : false,
        message : `This Email: ${email} is not Registered With Us Enter a Valid Email`
      });
    }
    if(!user)
    {
      return res.status(400).json({
        success : false,
        message : `This Email: ${email} is not Registered With Us Enter a Valid Email`
      });
    }

    // check for existing user or not
    const existingUser = User.findOne({email});
    if(!existingUser)
    {
      res.status(400).json({
        success : false,
        message : "User not exist not available for this email"
      });
    }

    // generate token
    const token = crypto.randomBytes(20).toString("hex");  

    // update user by adding token and expiration time in the user model
    const updateDetail = await User.findOneAndUpdate({email : email} , {
                                                    token : token ,
                                                    resetPasswordExpire : Date.now() + 5*60*1000,
                                                    tokenVisited : false,
                                                  },
                                                    {new : true},
                                                  );

    // create url
    const url = `http://localhost:5173/update-password/${token}`;


    // send link to mail for reset
    await mailSender(email , "Password Reset Link" , `click this link to update your password 👉 ${url}`);

    return res.status(200).json({
      success : true,
      message : "Email sent successfully, please check email and change password",
    });

  }
  catch(error){
    console.log("error occur while generating reset password token", error);
    return res.status(500).json({
      success : false,
      message : "error occur while generating reset password token",
    });
  }
}





// reset password

exports.resetPassword = async(req,res)=>{
  try{

    const{password , token , confirmPassword} = req.body;
    // add token to find out the user, thats why we add it in the user model during reset password token

    //⚠️ token added in the req body by frontend

    if(!password || !confirmPassword || !token)
    {
      return res.status(400).json({
        success : false,
        message : "fill all the fields",
      });
    }

    if(password !== confirmPassword)
    {
      return res.status(400).json({
        success : false,
        message : "password not matched",
      });
    }

    // fetch user detail from db using token
    const userDetail = await User.findOne({token : token});


    //if no entry found means token expire
    if(!userDetail)
    {
      return res.status(400).json({
        success : false,
        message : "This Link is expired",
      });
    }

    if(userDetail.tokenVisited === true)
    {
      return res.status(400).json({
        success : false,
        message : "This Link is expired",
        frontMessage : "This Link is expired"
      });
    }

    // token time checkk
    if(!(userDetail.resetPasswordExpire > Date.now()))
    {
      return res.status(400).json({
        success : false,
        message : "Link is expired , time exceed",
      });
    }

    const hashPassword = await bcrypt.hash(password ,10);

    await User.findOneAndUpdate({token : token}, {password : hashPassword , tokenVisited:true}, {new : true});

    return res.status(200).json({
      success : true,
      message : "Password reset successfully",
    });

  }
  catch(error)
  {
    console.log("error occur while reseting password ", error);
    return res.status(500).json({
      success : false,
      message : "error occur while reseting password",
    });
  }
}