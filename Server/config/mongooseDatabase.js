const mongoose = require('mongoose');

require('dotenv').config();

exports.dbConnect = ()=>{

  mongoose.connect(process.env.MONGODB_URL)
  .then(()=>{
    console.log('Mongo Database connect successfully')
  })
  .catch((error)=>{
    console.log("Error while connecting MongoDB");
    console.error(error);
    process.exit(1);
  })

};