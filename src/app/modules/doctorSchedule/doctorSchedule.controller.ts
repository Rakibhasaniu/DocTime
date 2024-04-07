import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { DoctorSchedulesService } from "./doctorSchedule.service";


const insertIntoDB:RequestHandler = catchAsync(async(req,res) => {

    const user = req.user;

    const result = await DoctorSchedulesService.insertIntoDB(user,req.body);
 

    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:'DoctorSchedules created successfully',
        data:result
        
    })
})




export const DoctorSchedulesController ={
    insertIntoDB,
}