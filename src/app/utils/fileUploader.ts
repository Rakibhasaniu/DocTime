import multer from "multer"
import path from "path"
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'
import { ICloudinaryResponse, IUploadFile } from "../interface/file";

cloudinary.config({ 
  cloud_name: 'ddhnbjhvy', 
  api_key: '632311187928324', 
  api_secret: 'q-hNxQegIzQyoU6t_BD5loIpee0' 
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(process.cwd(),'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  const upload = multer({ storage: storage })

const uploadToCloudinary =async (file:IUploadFile):Promise<ICloudinaryResponse | undefined> => {
  
  return new Promise((resolve,reject) => {
    cloudinary.uploader.upload(file.path,
    // { public_id: file.originalname }, 
    (error:Error, result:ICloudinaryResponse) =>{
      fs.unlinkSync(file.path); //delete the local copy
      if(error){
        reject(error)
      } else {
        resolve(result);
      }
    })
  })
}


  

  export const fileUploader = {
    upload,
    uploadToCloudinary
  }



  
          
