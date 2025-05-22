const Profile = require("../models/Profile");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require('dotenv').config();

exports.updateProfile = async(req,res) =>{
  try{
    const {
      dateOfBirth = "",
      about = "",
      contactNumber,
      gender ,
      firstName = "",
      lastName = ""
      } = req.body;
    const id = req.user.id;

    if(!contactNumber || !gender || !id)
    {
      return res.status(400).json({
        success : false,
        message : "All fields are required",
      })
    }

    const userDetail = await User.findById(id);

    const user = await User.findByIdAndUpdate(id,{firstName , lastName})
    await user.save();

    const profile = await Profile.findById(userDetail.additionalDetails);

    /* method-1;
    const profileDetail = await Profile.findByIdAndUpdate({profile},
                                                          {
                                                            $push :{
                                                              dateOfBirth : dateOfBirth,
                                                              about : about,
                                                              contactNumber : contactNumber,
                                                              gender : gender,
                                                            }
                                                          },
                                                          {new : true}
    );
    */

    // method :- 2

    profile.gender = gender;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.dateOfBirth = dateOfBirth;

    await profile.save();

    const updatedUserDetails = await User.findById(id).populate("additionalDetails").exec()

    return res.status(200).json({
      success : true,
      message : "Profile detail updated successfully 🎉🎊",
      updatedUserDetails,
    });

  }
  catch(error)
  {
    console.error(error);
    return res.status(500).json({
      success : false,
      messsage : 'Error while updating the profile',
    });
  }
}





// delete account
// how to schedule this deletion operation ?
// chrone job ?
exports.deleteAccount = async(req,res)=>{
  try{
    // TODO: Find More on Job Schedule
		// const job = schedule.scheduleJob("10 * * * * *", function () {
		// 	console.log("The answer to life, the universe, and everything!");
		// });
		// console.log(job);
    const id = req.user.id;
    const userDetail = await User.findById(id);
    if(!userDetail)
    {
      return res.status(404).json({
        success : false,
        messsage : 'User not found',
      });
    }

    //delete profile
    await Profile.findByIdAndDelete({_id:userDetail.additionalDetails});

    // delete user
    await User.findByIdAndDelete({_id:id});

    // TODO : delete user from all the enrolled courses

    return res.status(200).json({
      success : true,
      message : "Profile deleted successfully ",
    });

  }
  catch(error)
  {
    console.error(error);
    return res.status(500).json({
      success : false,
      messsage : 'Error while deleting account',
    });
  }
}



exports.getAllUserDetails = async(req, res)=>{
  try{
    const id = req.user.id;

    const userDetail = await User.findById(id).populate("additionalDetails").exec();
    return res.status(200).json({
      
      success : true,
      message : "User data fetched successfully ",
      data : userDetail
    });
  }
  catch(error)
  {
    onsole.error(error);
    return res.status(500).json({
      success : false,
      messsage : 'Error while fetching all the users details',
    });
  }
}


exports.updateDisplayPicture = async(req , res) =>{
  try{
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000,
    )

    console.log("image :- ",image);
    const updatedProfile = await User.findByIdAndUpdate({_id:userId},{image : image.secure_url},{new : true});

    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  }
  catch(error)
  {
    return res.status(500).json({
      success: false,
      message: "error while updating the profile picture",
    })
  }
}



exports.getEnrolledCourses = async (req,res) =>{
  try{
    const userId = req.user.id;
    const userDetails = await User.findOne({_id : userId}).populate("courses").exec();

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  }
  catch(error)
  {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}