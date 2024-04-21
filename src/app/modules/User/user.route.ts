import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";
import {v2 as cloudinary} from 'cloudinary';

import { fileUploader } from "../../utils/fileUploader";
import { userValidation } from "./user.validation";
import validateRequest from "../../middleware/validateRequest";


// cloudinary.config({ 
//     cloud_name: 'ddhnbjhvy', 
//     api_key: '632311187928324', 
//     api_secret: 'q-hNxQegIzQyoU6t_BD5loIpee0' 
//   });

//   cloudinary.uploader.upload("D:\\health-care\\uploads\\rakib1.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });

const router = Router();

// router.post('/create-admin',auth(UserRole.ADMIN),fileUploader.upload.single('file'),
// UserController.createAdmin)

router.get(
  '/',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.getAllFromDB
);
router.get(
  '/me',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  UserController.getMyProfile
)
router.post('/create-admin',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),fileUploader.upload.single('file'),
(req:Request,res:Response,next:NextFunction)=>{
  req.body=userValidation.createAdmin.parse(JSON.parse(req.body.data));
  return UserController.createAdmin(req,res,next)
})
router.post(
  "/create-doctor",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
      req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data))
      return UserController.createDoctor(req, res, next)
  }
);
router.post(
  "/create-patient",
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
      req.body = userValidation.createPatient.parse(JSON.parse(req.body.data))
      return UserController.createPatient(req, res, next)
  }
);

router.patch(
  '/:id/status',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(userValidation.updateStatus),
  UserController.changeProfileStatus
);
router.patch(
  "/update-my-profile",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data)
      return UserController.updateMyProfie(req, res, next)
  }
);
export const UserRoutes = router;
