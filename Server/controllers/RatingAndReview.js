const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//creating rating
exports.createRating = async(req,res) =>{
  try{
    
    const userId = req.user.id;
    const {rating,review,courseId} = req.body;

    // check if user enrolled or not in the course;
    const courseDetails = await Course.findOne({_id:courseId,
                                          studentEnrolled : {$elemMatch : {$eq : userId}},
                                        });

    if(!courseDetails)
    {
      return res.status(404).json({
        success: false,
        messsage : "Student is not enrolled in the course",
      });
    }

    // check if already reviewed or not
    const alreadyReviewed = await RatingAndReview.findOne({user:userId ,course:courseId});

    if(alreadyReviewed)
    {
      return res.status(403).json({
        success: false,
        messsage : "Student is already reviewed the course",
      });
    }

    // create rating and review
    const ratingReview = RatingAndReview.create({
      rating,
      review,
      course : courseId,
      user : userId,
    })

    // update the rating and review in the course
    const updateCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
                                                    {$push:{
                                                      ratingAndReview:ratingReview._id,
                                                    }},
                                                    {new:true},
                                                  );

    console.log(updateCourseDetails);
    

    return res.status(200).json({
      success: true,
      messsage : " All courses returned successfully",
      ratingReview,
    });
  }
  catch(error)
  {
    console.error(error);
    return res.status(500).json({
      success : false,
      messsage : 'Error while creating rating and review',
    });
  }
}



// get avg rating

exports.getAverageRating = async(req,res) =>{
  try{
    
    const courseId = req.body.courseId;

    const result = await RatingAndReview.aggregate(
      [
        // define all the steps of aggregate
        // step 1:- find all the entries with course id
        {
          $match :{
            course : new mongoose.Types.ObjectId(courseId),
          },
        },

        // step 2 :- group all the rating and find the average
        {
          $group :{
            _id : null, // means no criteria for grouping
            averageRating : { $avg : "$rating"},
          },
        },
      ]
    )

    // aggregate return array
    if(result.length()>0)
    {
      return res.status(200).json({
        success: true,
        messsage : " Average rating of the course returned successfully",
        averageRating : result[0].averageRating,
      });
    }
    else{
      return res.status(200).json({
        success: true,
        messsage : " No rating found for this course",
        averageRating : 0,
      });
    }

    
  }
  catch(error)
  {
    console.error(error);
    return res.status(500).json({
      success : false,
      messsage : 'Error while fetching the average rating of the course',
    });
  }
}




// get all rating and reviews
exports.getAllRating = async(req,res) =>{
  try{
    
    const allReviews = await RatingAndReview.find({})
                                            .sort({rating : "desc"})
                                            .populate({
                                              path:"user",
                                              select:"firstName lastName email image",
                                            })
                                            .populate({
                                              path : "course",
                                              select : "courseName",
                                            })
                                            .exec();

    return res.status(200).json({
      success: true,
      messsage : " All reviews returned successfully",
      allReviews,
    });
  }
  catch(error)
  {
    console.error(error);
    return res.status(500).json({
      success : false,
      messsage : 'Error while fetching the all reviews',
    });
  }
}




// get all rating and reviews of particular course
exports.getAllRatingofCourse = async(req,res) =>{
  try{
    const {courseId} = req.body;

    const allReviews = await RatingAndReview.find({_id:courseId})
                                            .sort({rating : "desc"})
                                            .populate({
                                              path:"user",
                                              select:"firstName lastName email image",
                                            })
                                            .populate({
                                              path : "course",
                                              select : "courseName",
                                            })
                                            .exec();

    return res.status(200).json({
      success: true,
      messsage : " All reviews returned successfully",
      allReviews,
    });
  }
  catch(error)
  {
    console.error(error);
    return res.status(500).json({
      success : false,
      messsage : 'Error while fetching reviews of the courses',
    });
  }
}