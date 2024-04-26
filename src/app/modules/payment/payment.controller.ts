import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";


const initPayment = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.initPayment();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment Initiate successfully',
        data: result,
    });
});

export const PaymentController = {
    initPayment,
    
}