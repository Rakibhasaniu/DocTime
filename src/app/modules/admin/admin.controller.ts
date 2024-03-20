import { NextFunction, Request, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from '../../../shared/pick';
import { adminFilterAbleField } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";




const getAllAdmin = catchAsync(async(req,res) => {
    
        const filter=pick(req.query,adminFilterAbleField);
        const options =pick(req.query,['limit','page','sortOrder','sortBy'])
        const result = await AdminServices.getAllFromDB(filter,options);

    // res.status(200).json({
    //     success:true,
    //     message:'Admin Data Fetched Successfully',
    //     meta:result?.meta,
    //     data:result.data
    // })
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Admin Data Fetched Successfully',
        meta:result.meta,
        data:result.data
    })
    
})
const getSingleData = catchAsync(async(req,res)=> {
    
        const {id} = req.params;
        const result = await AdminServices.getSingleDataFromDB(id);
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Single Data Fetched Successfully',
            // meta:result.meta,
            data:result
        })

    
})
const updateData =catchAsync( async(req,res) =>{
   
        const {id} = req.params;
        const result = await AdminServices.updateDataIntoDB(id,req.body);
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Admin Data Updated',
            data:result
        })

    
    
})
const deleteData = catchAsync(async(req,res) =>{
    
        const {id} = req.params;
        const result = await AdminServices.deleteDataFromDB(id);
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Admin Data Deleted',
            data:result
        })

    
    
    
})
const softDeleteData = catchAsync(async(req,res)=>{
    
        const {id} = req.params;
        const result = await AdminServices.softDeleteDataFromDB(id);
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Admin Data Deleted',
            data:result
        })

   
    
})

export const AdminController = {
    getAllAdmin,
    getSingleData,
    updateData,
    deleteData,
    softDeleteData
}