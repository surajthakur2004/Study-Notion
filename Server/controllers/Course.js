const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

require('dotenv').config();

exports.createCourse = async (req , res)=>{
  try{
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag:_tag,
      category,
      status,
      instructions:_instructions,
    } = req.body;

    // get thumbnail

    const thumbnail = req.files.thumbnailImage;

    // Convert the tag and instructions from stringified Array to Array
    const tag = JSON.parse(_tag)
    const instructions = JSON.parse(_instructions)

    if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag.length ||!thumbnail ||!category || !instructions.length)
    {
      return res.status(400).json({
        success: false,
        messsage : "All fields are required"
      });
    }

    if (!status || status === undefined) {
			status = "Draft";
		}

    // find out the  instructor , which make the course
    const userId = req.user.id; // fetch the data from payload (user.token = token) which we insert in the user during auth

    const instructorDetail = await User.findById(userId,{accountType : "Instructor"});

    if(!instructorDetail)
    {
      return res.status(404).json({
        success: false,
        messsage : "Instructor Detail not found"
      });
    }

    console.log("Instructor Detail :- ", instructorDetail);


    // validate the tag
    const categoryDetail = await Category.findById(category);
    if(!categoryDetail)
    {
      return res.status(404).json({
        success: false,
        messsage : "Category Details not found"
      });
    }


    // upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME );


    // create an entry for a new course in db
    const newCourse = await Course.create({
      courseName : courseName,
      courseDescription : courseDescription,
      instructor : instructorDetail._id,
      whatYouWillLearn : whatYouWillLearn,
      price : price,
      tag : tag,
      category : categoryDetail._id,
      thumbnail : thumbnailImage.secure_url,
      status : status,
      instructions : instructions,
    });


    //add the above course in the instructor schema
    await User.findByIdAndUpdate(
      {_id:instructorDetail._id},
      {
        $push :{
          courses : newCourse._id,
        }
      },
      {new : true},
    );


    // update the tag schema so that the course are visible under the tag
    await Category.findByIdAndUpdate(
      {_id : category},
      {
        $push :{
          course : newCourse._id,
        }
      },
      { new : true},
    );

    return res.status(200).json({
      success : true,
      data : newCourse,
      messsage : 'Course created successfully'
    });

  }
  catch(error)
  {
    console.error(error);
    return res.status(500).json({
      success : false,
      messsage : 'Error while creating the course',
    });
  }
};




// get all the course

exports.getAllCourse = async(req,res) =>{
  try{
    const allCourses = await find({},{
                                      courseName : true,
                                      courseDescription : true,
                                      thumbnail : true,
                                      price : true,
                                      whatYouWillLearn : true,
                                      instructor : true,}).populate("instructor").exec()

    return res.status(200).json({
      success: true,
      messsage : " All courses returned successfully",
      allCourses,
    });
  }
  catch(error)
  {
    console.error(error);
    return res.status(500).json({
      success : false,
      messsage : 'Error while fetching all the courses',
    });
  }
}


// get the all detail of a course

exports.getCourseDetails = async(req,res) =>{
  try{
    // get course id
    const {courseId} = req.body;

    const courseDetails = await find({_id : courseId})
                                      .populate(
                                        {
                                          path : "instructor",
                                          populate :{
                                            path : "additionalDetails",
                                          },
                                        }
                                      )
                                      .populate("category")
                                      .populate("ratingAndReview")
                                      .populate({
                                        path:"courseContent",
                                        populate :{
                                          path : "subSection",
                                        }
                                      })
                                      .populate(
                                        {
                                          path : "studentEnrolled",
                                          populate :{
                                            path : "additionalDetails",
                                          },
                                        }
                                      )
                                      .exec();

    if(!courseDetails)
    {
      return res.status(400).json({
        success: false,
        messsage : `Could not find the course with id :- ${courseId}`,
      });
    }


    return res.status(200).json({
      success: true,
      messsage : " All course details returned successfully",
      data : courseDetails,
    });
  }
  catch(error)
  {
    console.error(error);
    return res.status(500).json({
      success : false,
      messsage : 'Error while fetching the course details',
    });
  }
}
