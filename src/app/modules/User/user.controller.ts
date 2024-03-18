import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";


const createAdmin = async(req:Request,res:Response,next:NextFunction) => {
    // const {admin} = req.body;
    try{
        const result = await UserService.createAdminInDB(req.body);
    
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Admin Data Deleted',
            data:result
        })
    }catch(err){
        next(err);
    }
}

export const UserController = {
    createAdmin,

}