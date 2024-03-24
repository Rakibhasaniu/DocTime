import { NextFunction, Request, RequestHandler, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../../utils/pick";
import { adminFlterData } from "./admin.constant";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";



const getAllAdmin:RequestHandler = catchAsync(async(req,res) => {

        const filter = pick(req.query,adminFlterData);
        const option = pick(req.query,["sortBy","limit","page",'sortOrder']);
        const result = await AdminServices.getAllAdminFromDB(filter,option);

    //  res.status(200).json({
    //     success:true,
    //     message:'Admin retrieve successfully',
    //     meta:result.meta,
    //     data:result.data
    //  })
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Admin retrieve successfully',
        meta:result.meta,
        data:result.data
    })
    
})
const getSingleAdmin:RequestHandler = catchAsync(async(req,res) => {
        const {id} = req.params;
        const result = await AdminServices.getSingleAdmin(id);
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Admin retrieve successfully',
            data:result
        })
})
const updateAdminData:RequestHandler =catchAsync(async(req,res) => {
        const {id} = req.params;
        const result = await AdminServices.updateAdminDataFromDB(id,req.body);
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Admin updated successfully',
            data:result
        })
})
const deleteData:RequestHandler = catchAsync(async(req,res) => {
        const {id} = req.params;
        const result = await AdminServices.deleteDataFromDB(id);
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Admin deleted successfully',
            data:result
        })
})
const softDeleteData:RequestHandler = catchAsync(async(req,res) => {
        const {id} = req.params;
        const result = await AdminServices.softDeleteDataFromDB(id);
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Admin deleted successfully',
            data:result
        })
})






export const AdminController = {
    getAllAdmin,
    getSingleAdmin,
    updateAdminData,
    deleteData,
    softDeleteData

}