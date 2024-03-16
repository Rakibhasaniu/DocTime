
import { Request, Response } from "express";
import { AdminServices } from "./admin.service";


const getAllAdmin = async(req:Request,res:Response) => {
    try{


    const result = await AdminServices.getAllFromDB(req.query);

    res.status(200).json({
        success:true,
        message:'Admin Data Fetched Successfully',
        data:result
    })
    } catch (err){
        res.status(500).json({
            success:false,
            message: err?.name || 'Something went wrong',
            error:err

        })
    }
}


export const AdminController = {
    getAllAdmin
}