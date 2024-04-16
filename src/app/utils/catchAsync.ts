import { NextFunction, Request, RequestHandler, Response } from "express";


const catchAsync = (fn:RequestHandler) =>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        console.log(req)
        try {
            await fn(req,res,next)
        } catch (err) {
            next(err)
        }
    }
}

export default catchAsync;