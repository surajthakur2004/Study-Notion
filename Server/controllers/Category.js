const Category = require("../models/Category");

exports.createCategory = async (req , res)=>{
  try{

    // fetch data
    const {name , description} = req.body;

    // validation
    if(!name || !description)
    {
      return res.status(400).json({
        success: false,
        messsage : "All fields are required"
      });
    }

    // stored in db
    const categoryDetails = await Category.create({name : name , description : description});

    console.log("category Detail :- ", categoryDetails);

    return res.status(200).json({
        success: true,
        messsage : "Category created successfully",
      });

  }
  catch(error){
    console.log("Error occur while creating Category ");
    console.log(error);
    res.status(500).json({
      success : false,
      message :"Error occur while creating Category ",
    });
  }
}





exports.showAllCategories = async(req , res)=>{
  try{
    const allCategorys = await Category.find({},{name : true , description : true}); // fetch all tags , first {} show no filter to find , second {} for find tag having name and description
    
    return res.status(200).json({
      success: true,
      messsage : " All Category returned successfully",
      data: allCategorys,
    });
  }
  catch(error)
  {
    console.log("Error occur while fetching all Category ");
    console.log(error);
    res.status(500).json({
      success : false,
      message :"Error occur while fetching all Category ",
    });
  }
}





// category page detail
exports.categoryPageDetail = async(req , res)=>{
  try{
    // motive is to show the course first according to the categorry , then some other caegory to inspire the user for new course and then show him top courses to motivate for buying

    const{categoryId} = req.body;

    // find couse for selected category
    const selectedCategory = await Category.findById(categoryId).populate("courses").exec();
    
    if(!selectedCategory)
    {
      return res.status(404).json({
        success: false,
        messsage : " No course found for this category",
      });
    }


    // get courses from other category
    const differentCategories = await Category.find({_id:{$ne : categoryId}}).populate("courses").exec();
    // ne :- not equal to 


    // get top selling courses , acc to how much the courses sell


    
    return res.status(200).json({
      success: true,
      messsage : " courses from category are returned successfully",
      data :{
        selectedCategory,
        differentCategories,
      }
    });
  }
  catch(error)
  {
    console.log("Error occur while fetching all tags ");
    console.log(error);
    res.status(500).json({
      success : false,
      message :"Error occur while fetching courses from the category ",
    });
  }
}