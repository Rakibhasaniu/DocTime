import { Request, Response } from "express";
import { MetaService } from "./meta.service";
import httpStatus from "http-status";
import { IAuthUser } from "../../interface/common";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const fetchDashboardMetaData = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {

    const user = req.user;
    const result = await MetaService.fetchDashboardMetaData(user as IAuthUser);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Meta data retrival successfully!",
        data: result
    })
});

export const MetaController = {
    fetchDashboardMetaData
}