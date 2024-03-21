import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";


const loginUser=catchAsync(async(req:Request,res:Response) => {
    const result = await AuthServices.loginUser(req.body);
    const {refreshToken} = result;
    res.cookie('refreshToken',refreshToken,{
        secure:false,
        httpOnly:true
    })

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Login Successful',
        data:{
            accessToken:result.accessToken,
            needPasswordChange:result.needPasswordChange,
            
        }
    })
})

export const AuthController = {
    loginUser
}