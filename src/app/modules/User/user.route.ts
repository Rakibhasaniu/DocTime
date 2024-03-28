import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";
import  { fileUploader } from "../../utils/fileUploader";


const router = Router();


          
          
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'ddhnbjhvy', 
  api_key: '632311187928324', 
  api_secret: 'q-hNxQegIzQyoU6t_BD5loIpee0' 
});

cloudinary.uploader.upload("C:\\docTime\\uploads\\rakib.jpg",
  { public_id: "olympic_flag" }, 
  function(error, result) {console.log(result); });



router.post('/create-admin',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),fileUploader.upload.single('file'),userController.createAdmin)


export const userRoutes = router;