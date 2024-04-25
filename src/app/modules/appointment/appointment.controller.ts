import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AppointmentService } from "./appointment.service";
import { IAuthUser } from "../../interface/common";
import pick from "../../utils/pick";


const  createAppointment = catchAsync(async(req:Request & {user?:IAuthUser},res:Response) =>{
    const user = req.user
    const result = await AppointmentService.createAppointment(user as IAuthUser,req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Appointment created",
        data: result
    })
})
const  getMyAppointment = catchAsync(async(req:Request & {user?:IAuthUser},res:Response) =>{
    const user = req.user;
    const filter = pick(req.query,['status','paymentStatus']);
    const options = pick(req.query,['limit','page','sortBy','sortOrder']);
    const result = await AppointmentService.getMyAppointMent(user as IAuthUser,filter,options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Appointment retrieve successfully",
        data: result
    })
})

export const AppointmentController = {
    createAppointment,
    getMyAppointment,
}