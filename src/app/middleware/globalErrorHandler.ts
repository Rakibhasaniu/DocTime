// import { ErrorRequestHandler, NextFunction, Request, Response } from "express"
// import httpStatus from "http-status"
// import { ZodError, ZodIssue, z } from "zod";
// import handleZodError from "../errors/handleZodError";


// const globalErrorHandler:ErrorRequestHandler = (err, req, res, next) => {
    
//     let statusCode = err.status ||  500;
//     let message = err.message || 'Something went wrong';
    
//     // let errorDetails = {
//     //     zodError:[ {
//     //         // field:'',
//     //         message:'something went wrong'
//     //     }]
//     // }
   
    
    
//     if(err instanceof ZodError){
//         const simplifiedError = handleZodError(err)
//         console.log(simplifiedError)
//         statusCode=simplifiedError?.statusCode,
//     //    simplifiedError.errorDetails.map(el => {
//     //     message=el.message;
//     //    })
//         message=simplifiedError.message,
//         // errorDetails=simplifiedError?.errorDetails
        
//     }

//     res.status(statusCode).json({
//         success: false,
//         message,
//         // errorDetails
//     })
// };

// export default globalErrorHandler;

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";


const globalErrorHandler = (err:any,req:Request,res:Response,next:NextFunction) => {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success:false,
        message:err.message || 'Something went wrong',
        error:err
    })
}

export default globalErrorHandler;
