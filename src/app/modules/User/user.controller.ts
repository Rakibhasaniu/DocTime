import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";


const createAdmin = catchAsync(async(req,res) => {
    // const {admin} = req.body;
   
        const result = await UserService.createAdminInDB(req.body);
    
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Admin Data Deleted',
            data:result
        })
    
})

export const UserController = {
    createAdmin,

}