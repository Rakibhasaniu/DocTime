import {  PrismaClient, UserRole } from "@prisma/client"
import bcrypt  from 'bcrypt';
import { fileUploader } from "../../utils/fileUploader";

const prisma = new PrismaClient();

const createAdminIntoDB = async(req:any) => {


    const file = req.file;
    if(file){
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.admin.profilePhoto=uploadToCloudinary?.secure_url
        console.log(req.body)
    }
    const hashedPassword:string = await bcrypt.hash(req.body.password, 10);
    // console.log(payload)
    const userData = {
        email:req.body.admin.email,
        password:hashedPassword,
        role:UserRole.ADMIN
    }

    const result = await prisma.$transaction(async(transac)=> {
        await transac.user.create({
            data:userData
        })
        const createAdmin = await transac.admin.create({
            data:req.body.admin
        })
        return createAdmin;
    })
    return result;
}

export const userServices ={
    createAdminIntoDB
}