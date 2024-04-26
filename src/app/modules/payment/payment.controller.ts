import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";


const initPayment = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const result = await PaymentService.initPayment(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment Initiate successfully',
        data: result,
    });
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.validatePayment(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment validate successfully',
        data: result,
    });
});

export const PaymentController = {
    initPayment,
    validatePayment

}