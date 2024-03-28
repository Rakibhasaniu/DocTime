import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";
import  { fileUploader } from "../../utils/fileUploader";
import { UserValidation } from "./user.validation";


const router = Router();


router.post('/create-admin',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),fileUploader.upload.single('file'),
(req:Request,res:Response,next:NextFunction)=>{
  req.body=UserValidation.createAdmin.parse(JSON.parse(req.body.data));
  return userController.createAdmin(req,res,next)
})
router.post('/create-doctor',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),fileUploader.upload.single('file'),
(req:Request,res:Response,next:NextFunction)=>{
  req.body=UserValidation.createDoctor.parse(JSON.parse(req.body.data));
  return userController.createAdmin(req,res,next)
})


export const userRoutes = router;