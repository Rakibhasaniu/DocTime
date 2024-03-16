import { Request, Response } from "express";
import { UserService } from "./user.service";


const createAdmin = async(req:Request,res:Response) => {
    // const {admin} = req.body;
    try{
        const result = await UserService.createAdminInDB(req.body);
    
    res.status(200).json({
        success:true,
        message:"Admin Created Successfully",
        data:result
    })
    }catch(err){
        res.status(500).json({
            success:false,
            message: err?.name || 'Something went wrong',
            error:err

        })
    }
}

export const UserController = {
    createAdmin,

}