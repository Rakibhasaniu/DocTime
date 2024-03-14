import { Request, Response } from "express";
import { UserService } from "./user.service";


const createAdmin = async(req:Request,res:Response) => {
    // const {admin} = req.body;
    const result = await UserService.createAdminInDB(req.body);
    
    res.send(result)
}

export const UserController = {
    createAdmin,

}