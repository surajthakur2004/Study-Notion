const express = require('express');
const router = express.Router();

const {
  createCourse,
  getCourseDetails,
  getAllCourse,
} = require("../controllers/Course");


const {
  showAllCategories,
  createCategory,
  categoryPageDetail,
} = require("../controllers/Category");


const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");


const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection");

const {
  createRating,
  getAllRating,
  getAverageRating,
} = require("../controllers/RatingAndReview");


const{auth,isAdmin, isInstructor, isStudent} = require("../middlewares/auth");




// courses routes (only by instructor)
router.post("/createCourse", auth, isInstructor,createCourse);

router.post('/addSection',auth,isInstructor,createSection);

router.post("/updateSection" , auth , isInstructor, updateSection);

router.post("/deleteSection" , auth , isInstructor , deleteSection);

router.post('/addSubSection',auth,isInstructor,createSubSection);

router.post("/updateSection" , auth , isInstructor, updateSubSection);

router.post("/deleteSection" , auth , isInstructor,deleteSubSection);

router.get("/getAllCourses",getAllCourse);

router.get("/getCourseDetails",getCourseDetails);


// category route (only by admin)

router.post("/createCategory",auth,isAdmin,createCategory);

router.get("/showAllCategories",showAllCategories)

router.post("/getCategoryPageDetails",categoryPageDetail)


// rating and review
router.post("/createRating",auth,isStudent,createRating)

router.get("/getAverageRating",getAverageRating)

router.get("/getReviewa",getAllRating)

module.exports = router

