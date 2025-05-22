const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require('dotenv').config();

exports.createSubSection = async(req , res) =>{
  try{
    const{title , sectionId, timeDuration , description} = req.body;

    const video = req.files.videoFile;

    
    if(!title || !sectionId || !timeDuration ||!description ||!video){
      return res.status(400).json({
        success:false,
        message : "All fields are required",
      });
    }


    // upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(video , process.env.FOLDER_NAME);

    //create subSection
    const newSubSection  = await Section.create({
      title : title,
      timeDuration : timeDuration,
      description : description,
      videoUrl : uploadDetails.secure_url,
    });

    // update the sub-section in the section
    const updateSectionDetails = await Section.findByIdAndUpdate(
                                                                {_id:sectionId},
                                                                {
                                                                  $push : {
                                                                    subSection : newSubSection._id,
                                                                  }
                                                                },
                                                                {new : true}
                                                              )
    
    // populate the  subsection in the updateSectionDetails

    return res.status(200).json({
      success : true,
      message : `"${title}" created successfully`,
      updateCourseDetails,
    })
  }
  catch(error)
  {
    console.error(error);
    return res.status(500).json({
      success : false,
      messsage : 'Unable to creating the sub-section, please try again..',
    });
  }
}





// update the sub-section

exports.updateSubSection = async(req , res) =>{
  try{
    const{title , sectionId, description} = req.body;
    const subSection = await SubSection.findById(sectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if(!title || !description){
      return res.status(400).json({
        success:false,
        message : "missing properties",
      });
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }

    if(req.files && req.files.video !== undefined){
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME,
      )
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    //update sub-section
    await subSection.save();

    // no need to update the subsection in the section coz in section , id of sub-section stored

    return res.status(200).json({
      success : true,
      message : `"${title}" updated successfully`,
      updateSubSection,
    })
  }
  catch(error)
  {
    console.error(error);
    return res.status(500).json({
      success : false,
      messsage : 'Unable to update the sub-section, please try again..',
    });
  }
}





// delete the sub-section

exports.deleteSubSection = async(req , res) =>{
  try{
    const{subSectionId, sectionId} = req.body;

    if(!subSectionId){
      return res.status(400).json({
        success:false,
        message : "missing sectionId",
      });
    }

    await Section.findByIdAndUpdate({_id : sectionId},{$pull:{subSection : subSectionId},},{new : true});

    const subsection = await SubSection.findByIdAndDelete({_id : subSectionId});

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" })
    }

    // also delete from Section ?


    return res.status(200).json({
      success : true,
      message : `Subsection Deleted successfully`,
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