import { Request, RequestHandler, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";

const createAdmin:RequestHandler = catchAsync(async(req,res) => {
   // console.log(req.file)
   // console.log(req.body.data)
        const result = await userServices.createAdminIntoDB(req);
     res.status(200).json({
        success:true,
        message:'Admin created successfully',
        data:result
     })
})
const createDoctor:RequestHandler = catchAsync(async(req,res) => {
   // console.log(req.file)
   // console.log(req.body.data)
        const result = await userServices.createDoctorIntoDB(req);
     res.status(200).json({
        success:true,
        message:'Doctor created successfully',
        data:result
     })
})
const createPatient:RequestHandler = catchAsync(async(req,res) => {
   // console.log(req.file)
   // console.log('data',req.body)
        const result = await userServices.createPatientIntoDB(req);
     res.status(200).json({
        success:true,
        message:'Patient created successfully',
        data:result
     })
})


export const userController = {
    createAdmin,
    createDoctor,
    createPatient
}