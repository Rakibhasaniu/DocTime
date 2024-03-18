
import { Request, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from '../../../shared/pick';
import { adminFilterAbleField } from "./admin.constant";



const getAllAdmin = async(req:Request,res:Response) => {
    try{
        const filter=pick(req.query,adminFilterAbleField);
        const options =pick(req.query,['limit','page','sortOrder','sortBy'])
        const result = await AdminServices.getAllFromDB(filter,options);

    res.status(200).json({
        success:true,
        message:'Admin Data Fetched Successfully',
        meta:result?.meta,
        data:result.data
    })
    } catch (err){
        res.status(500).json({
            success:false,
            message: err?.name || 'Something went wrong',
            error:err

        })
    }
}
const getSingleData = async(req:Request,res:Response)=>{
    try{
        const {id} = req.params;
        const result = await AdminServices.getSingleDataFromDB(id);
        res.status(200).json({
            success:true,
            message:'Admin Data Fetched By Id',
            // meta:result?.meta,
            data:result
        })

    }
    catch(err){
        res.status(500).json({
            success:false,
            message: err?.name || 'Something went wrong',
            error:err

        })
    }
    
}

export const AdminController = {
    getAllAdmin,
    getSingleData
}