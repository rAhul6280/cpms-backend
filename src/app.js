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

export default app;



