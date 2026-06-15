import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
})

async function uploadOnCLoudinary(localPath){
    if(!localPath||!localPath.trim())return null;
    try {
        const response=await cloudinary.uploader.upload(localPath,{'resource_type':'image'})
        console.log(response);
        console.log('File uploaded successfully on cloudinary');
        return response;
    } catch (error) {
        console.log("file upload failed",error.message)
        return null;
    }
}

export {uploadOnCLoudinary}