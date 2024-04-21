import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../utils/pick";
import { adminFilterableFields } from "./admin.constant";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from 'http-status'

const getAllAdmin = catchAsync(async(req:Request,res:Response,next:NextFunction) => {
    
        const filters = pick(req.query,adminFilterableFields)
        const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
        const result = await AdminService.getAllAdminFromDB(filters,options);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Admin data fetched!",
            meta:result.meta,
            data: result.data
        })

    
})
const getSingleAdmin = catchAsync(async(req:Request,res:Response,next:NextFunction) => {
    
        const {id} = req.params;
        const result = await AdminService.getSingleAdmin(id);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: " Single Admin data fetched!",
            data: result
        })

})
const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await AdminService.updateIntoDB(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data updated!",
        data: result
    })
})
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await AdminService.deleteFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data deleted!",
        data: result
    })
})


const softDeleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await AdminService.softDeleteFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data deleted!",
        data: result
    })
});
export const AdminController = {
    getAllAdmin,
    getSingleAdmin,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
}