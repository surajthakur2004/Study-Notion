const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');



// auth
exports.auth = async(req , res, next)=>{
  try{

    // extract token
    const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");
    if( !token)
    {
      return res.status(401).json({
        success : false,
        message : " U are logged off(token missing), please login"
      });
    }


    // verify the token
    try{
      const decode = await jwt.verify(token , process.env.JWT_SECRET);
      console.log("decode token :- ",decode);
      req.user = decode;
    }
    catch(err)
    {
      console.log("error occured in veryfying the token");
      console.log(err)
      return res.status(401).json({
        success : false,
        message : " error in verifying the token , please login again"
      });
    }

    next();

  }
  catch(error)
  {
    console.log("error occured while authentication the user");
      console.log(error);
      return res.status(401).json({
        success : false,
        message : " error occured while authentication the user"
      });
  }
}





// isStudent
exports.isStudent = async(req , res, next)=>{
  try{

    if(req.user.accountType !== "Student")
    {
      return res.status(401).json({
        success : false,
        message : " only student can visit this route"
      });
    }


    next();

  }
  catch(error)
  {
    console.log("error occured while authorisation the student");
      console.log(error);
      return res.status(500).json({
        success : false,
        message : " error occured while authorisation the student"
      });
  }
}








// isInstructor

exports.isInstructor = async(req , res, next)=>{
  try{

    if(req.user.accountType !== "Instructor")
    {
      return res.status(401).json({
        success : false,
        message : " only Instructor can visit this routev"
      });
    }


    next();

  }
  catch(error)
  {
    console.log("error occured while authorisation the Instructor");
      console.log(error);
      return res.status(500).json({
        success : false,
        message : " error occured while authorisation the Instructor"
      });
  }
}





// isAdmin

exports.isAdmin = async(req , res, next)=>{
  try{

    if(req.user.accountType !== "Admin")
    {
      return res.status(401).json({
        success : false,
        message : " only Admin can visit this routev"
      });
    }


    next();

  }
  catch(error)
  {
    console.log("error occured while authorisation the Admin");
      console.log(error);
      return res.status(500).json({
        success : false,
        message : " error occured while authorisation the Admin"
      });
  }
}
