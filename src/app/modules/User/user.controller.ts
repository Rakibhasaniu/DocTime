import { Request, RequestHandler, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import pick from "../../utils/pick";
import { userFilterAbleField } from "./user.constant";

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
const getAllUsers = catchAsync(async(req,res) => {

   const filter = pick(req.query,userFilterAbleField);
   const option = pick(req.query,["sortBy","limit","page",'sortOrder']);
   const result = await userServices.getAllUserFromDB(filter,option);

//  res.status(200).json({
//     success:true,
//     message:'Admin retrieve successfully',
//     meta:result.meta,
//     data:result.data
//  })
sendResponse(res,{
   statusCode:httpStatus.OK,
   success:true,
   message:'Admin retrieve successfully',
   meta:result.meta,
   data:result.data
})

})
const changeProfileStatus = catchAsync(async(req,res) => {
   const {id} = req.params;
      const result = await  userServices.changeProfileStatus(id, req.body);
      sendResponse(res,{
         statusCode:httpStatus.OK,
         success:true,
         message:'User Profile Status Changed',
         
         data:result
      })
})


export const userController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUsers,
    changeProfileStatus
    
}