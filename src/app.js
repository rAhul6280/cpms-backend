import express from 'express'
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db.js';

const app=express();
app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(cors());
app.use(cookieParser());


connectDB()
.then(()=>{
    const port=process.env.PORT;
    // console.log(port);
    app.listen(port,()=>{
        console.log("Server is running on port :",port)
    })
})
.catch((err)=>console.log(err))

app.get('/',(req,res)=>{
    res.send("API is running !")
})


//routes

import userRoutes from './routes/user.routes.js';
import studentRoute from './routes/student.route.js';
import recruiterRoute from './routes/recruiter.route.js';
import adminRoute from './routes/admin.route.js';
app.use('/api/user',userRoutes);


//student routes
app.use('/api/student',studentRoute);


//recruiter routes
app.use('/api/recruiter', recruiterRoute)


//admin routes
app.use('/api/admin',adminRoute)





//error handling middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;



