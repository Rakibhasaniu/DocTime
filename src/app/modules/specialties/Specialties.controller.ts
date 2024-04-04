import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { SpecialtiesServices } from "./Specialties.service";


const insertIntoDB:RequestHandler = catchAsync(async(req,res) => {

    const result = await SpecialtiesServices.insertIntoDB(req);
 

    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:'Specialties created successfully',
        data:result
        
    })
})

const  getAllData = catchAsync(async(req,res) => {
    const result = await SpecialtiesServices.getAllSpecialtiesFromDB();

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success: true ,
        message: 'Get all specialties',
        data:result
    })
})
const  deleteData = catchAsync(async(req,res) => {
    const result = await SpecialtiesServices.deleteDataFromDB(req.params.id);

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success: true ,
        message: 'Delete Specialties Data',
        data:result
    })
})



export const SpecialtiesController ={
    insertIntoDB,
    getAllData,
    deleteData
}