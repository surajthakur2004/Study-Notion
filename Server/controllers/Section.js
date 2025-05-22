const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async(req , res) =>{
  try{
    const{sectionName , courseId} = req.body;

    if(!sectionName || !courseId){
      return res.status(400).json({
        success:false,
        message : "missing properties",
      });
    }

    //create section
    const newSection  = await Section.create({sectionName});

    // update the section the in course
    const updateCourseDetails = await Course.findByIdAndUpdate(
                                                                {courseId},
                                                                {
                                                                  $push : {
                                                                    courseContent : newSection._id,
                                                                  }
                                                                },
                                                                {new : true}
                                                              )
    
    // populate the section and subsection both in the updatedCourseDetails

    return res.status(200).json({
      success : true,
      message : `Section "${sectionName}" created successfully`,
      updateCourseDetails,
    })
  }
  catch(error)
  {
    console.error(error);
    return res.status(500).json({
      success : false,
      messsage : 'Unable to creating the section, please try again..',
    });
  }
}





// update the section

exports.updateSection = async(req , res) =>{
  try{
    const{sectionName , sectionId} = req.body;

    if(!sectionName || !sectionId){
      return res.status(400).json({
        success:false,
        message : "missing properties",
      });
    }

    //update section
    const newSection  = await Section.findByIdAndUpdate(sectionId, {$push : {sectionName : sectionName}}, {new : true});

    // no need to update the section the in course coz in course id , id of section stored

    return res.status(200).json({
      success : true,
      message : `Section "${sectionName}" updated successfully`,
      updateCourseDetails,
    })
  }
  catch(error)
  {
    console.error(error);
    return res.status(500).json({
      success : false,
      messsage : 'Unable to update the section, please try again..',
    });
  }
}





// delete the section

exports.deleteSection = async(req , res) =>{
  try{
    const{sectionId} = req.params;

    if(!sectionId){
      return res.status(400).json({
        success:false,
        message : "missing sectionId",
      });
    }
    await Section.findByIdAndDelete({sectionId});

    // also delete from course
    // await Course.findByIdAndDelete({})


    return res.status(200).json({
      success : true,
      message : `Section "${sectionName}" deleted successfully`,
      updateCourseDetails,
    })
  }
  catch(error)
  {
    console.error(error);
    return res.status(500).json({
      success : false,
      messsage : 'Unable to delete the section, please try again..',
    });
  }
}