import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { SchedulesServices } from "./schedule.service";


const insertIntoDB:RequestHandler = catchAsync(async(req,res) => {
    // console.log(req.body)

    const result = await SchedulesServices.inserIntoDB(req.body);
 

    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:'Schedules created successfully',
        data:result
        
    })
})




export const SchedulesController ={
    insertIntoDB,
}