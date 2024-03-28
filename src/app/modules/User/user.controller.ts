import { Request, RequestHandler, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";

const createAdmin:RequestHandler = catchAsync(async(req,res) => {
   console.log(req.file)
   console.log(req.body.data)
        const result = await userServices.createAdminIntoDB(req.body);
     res.status(200).json({
        success:true,
        message:'Admin created successfully',
        data:result
     })
})


export const userController = {
    createAdmin
}