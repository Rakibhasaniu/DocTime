import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";


const login:RequestHandler = catchAsync(async(req,res) => {
    const result = await AuthServices.logInUser(req.body);
    const {refreshToken} = result;
    res.cookie('refreshToken',refreshToken,{
        secure:false,
        httpOnly : true
    });

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Login Successfully',
        data:{
            accessToken:result.accessToken,
            needsPasswordChange:result.needPasswordChange,
        }
    })
})
const refreshToken:RequestHandler = catchAsync(async(req,res) => {
    const {refreshToken} = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);
 

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Refresh token generated Successfully',
        data:result
        // data:{
        //     accessToken:result.accessToken,
        //     needsPasswordChange:result.needPasswordChange,
        // }
    })
})
const changePassword = catchAsync(async(req:Request & { user?: any } ,res : Response) => {
    const user=req.user;

    const result = await AuthServices.changePassword(user,req.body);
 

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Password Changed Successfully',
        data:result
       
    })
})

const forgotPassword:RequestHandler = catchAsync(async(req,res) => {
    const result = await AuthServices.forgotPassword(req.body);

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Password forget successfully",
        data:result
    })
})



export const AuthController ={
    login,
    refreshToken,
    changePassword,
    forgotPassword

}