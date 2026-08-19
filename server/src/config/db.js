import mongoose,{connect} from 'mongoose'

export const connectDb=async()=>{
    try{
        await connect(process.env.MONGO_URI);
        console.log('database connect successfully');
    }
    catch(err){
        console.log(err.message);
    }
}