import { NextFunction, Request, RequestHandler, Response } from "express";
import pick from "../../utils/pick";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { DoctorServices } from "./doctor.service";
import { doctorFilterableFields } from "./doctor.constant";



const getAllDoctor:RequestHandler = catchAsync(async(req,res) => {

        const filter = pick(req.query,doctorFilterableFields);
        // console.log(filter)
        const option = pick(req.query,["sortBy","limit","page",'sortOrder']);
        // console.log(option)
        const result = await DoctorServices.getAllDoctorFromDB(filter,option);

    
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'All doctor retrieve successfully',
        meta:result.meta,
        data:result.data
    })
    
})
const getSingleDoctor:RequestHandler = catchAsync(async(req,res) => {
        const {id} = req.params;
        const result = await DoctorServices.getSingleDoctor(id);
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Doctor retrieve successfully',
            data:result
        })
})
const updateDoctorData:RequestHandler =catchAsync(async(req,res) => {
        const {id} = req.params;
        const result = await DoctorServices.updateDoctorDataFromDB(id,req.body);
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Doctor Data updated successfully',
            data:result
        })
})
const deleteData:RequestHandler = catchAsync(async(req,res) => {
        const {id} = req.params;
        const result = await DoctorServices.deleteDataFromDB(id);
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Doctor data deleted successfully',
            data:result
        })
})
// const softDeleteData:RequestHandler = catchAsync(async(req,res) => {
//         const {id} = req.params;
//         const result = await DoctorServices.softDeleteDataFromDB(id);
//         sendResponse(res,{
//             statusCode:httpStatus.OK,
//             success:true,
//             message:'Doctor deleted successfully',
//             data:result
//         })
// })






export const DoctorController = {
    getAllDoctor,
    getSingleDoctor,
    updateDoctorData,
    deleteData,
    // softDeleteData

}