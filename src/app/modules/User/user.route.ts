import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";
import  { fileUploader } from "../../utils/fileUploader";
import { UserValidation } from "./user.validation";


const router = Router();


router.get('/me',auth(UserRole.ADMIN,UserRole.DOCTOR,UserRole.PATIENT,UserRole.SUPER_ADMIN),userController.getMyProfile)
router.get('/',auth(UserRole.SUPER_ADMIN,UserRole.ADMIN),userController.getAllUsers)
router.post('/create-admin',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),fileUploader.upload.single('file'),
(req:Request,res:Response,next:NextFunction)=>{
  req.body=UserValidation.createAdmin.parse(JSON.parse(req.body.data));
  return userController.createAdmin(req,res,next)
})
router.post('/create-doctor',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),fileUploader.upload.single('file'),
(req:Request,res:Response,next:NextFunction)=>{
  req.body=UserValidation.createDoctor.parse(JSON.parse(req.body.data));
  return userController.createDoctor(req,res,next)
})
router.post('/create-patient',fileUploader.upload.single('file'),
(req:Request,res:Response,next:NextFunction)=>{
  // console.log(req.body)
  req.body=UserValidation.createPatient.parse(JSON.parse(req.body.data));
  return userController.createPatient(req,res,next)
})

router.patch('/:id/status',auth(UserRole.SUPER_ADMIN,UserRole.ADMIN),userController.changeProfileStatus)

router.patch('/update-my-profile',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN,UserRole.PATIENT,UserRole.DOCTOR),fileUploader.upload.single('file'),
(req:Request,res:Response,next:NextFunction)=>{
  req.body=JSON.parse(req.body.data);
  return userController.updateProfile(req,res,next)
})



export const userRoutes = router;