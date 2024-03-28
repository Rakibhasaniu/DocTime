import multer from "multer"
import path from "path"
// import {v2 as cloudinary} from 'cloudinary';

// cloudinary.config({ 
//   cloud_name: 'ddhnbjhvy', 
//   api_key: '632311187928324', 
//   api_secret: 'q-hNxQegIzQyoU6t_BD5loIpee0' 
// });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(process.cwd(),'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  const upload = multer({ storage: storage })

// const uploadToCloudinary =async (file:any) => {
  
//   cloudinary.uploader.upload("C:\\docTime\\uploads\\rakib.jpg",
//     { public_id: "olympic_flag" }, 
//     function(error, result) {console.log(result); });
// }


  

  export const fileUploader = {
    upload,
    // uploadToCloudinary
  }



  
          
