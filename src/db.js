
import mongoose from 'mongoose'
const DB_NAME='cpms'

async function connectDB(){
    try {
        // console.log(process.env.MONGODB_URI)

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log('MONGODB connected successufully!')
    } catch (error) {
        console.log("Error in DB connection",error);
        process.exit(1);
    }
}

export default connectDB

