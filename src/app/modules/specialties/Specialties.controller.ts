import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { SpecialtiesServices } from "./Specialties.service";


const insertIntoDB:RequestHandler = catchAsync(async(req,res) => {

    const result = await SpecialtiesServices.insertIntoDB();
 

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Specialties created successfully',
        data:result
        
    })
})



export const SpecialtiesController ={
    insertIntoDB
}