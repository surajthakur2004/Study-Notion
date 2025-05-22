const express = require('express');
const app = express();

const userRoute = require('./routes/User');
const courseRoute = require('./routes/Course');
const paymentRoute = require('./routes/Payment');
const profileRoute = require('./routes/Profile');

require('dotenv').config();

const database = require("./config/mongooseDatabase");
const cookieParser = require('cookie-parser');
const cors = require('cors') // for backend accessing the request of frontend
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 4000;

// database connect
database.dbConnect();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin : "http://localhost:5173",
    credentials : true,
  })
)

app.use(
  fileUpload({
    useTempFiles : true,
    tempFileDir : "/tmp",
  })
)

// cloudinary connect
cloudinaryConnect();

//routes
app.use("/api/v1/auth",userRoute);
app.use("/api/v1/profile",profileRoute);
app.use("/api/v1/payment",paymentRoute);
app.use("/api/v1/course",courseRoute);


// default route
app.get("/",(req,res)=>{
  return res.json({
    success:true,
    message:'your server is up and running ....'
  });
});

app.listen(PORT , ()=>{
  console.log(`App is running at ${PORT}`)
});

