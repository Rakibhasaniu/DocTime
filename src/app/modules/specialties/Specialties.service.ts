import { Request } from "express"
import { fileUploader } from "../../utils/fileUploader";
import prisma from "../../utils/prisma";

const insertIntoDB = async(req:Request) => {
    const file = req.file;
    if(file){
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.icon=uploadToCloudinary?.secure_url;
    }

    const result = await prisma.specialties.create({
        data:req.body
    })
    return result
}

const getAllSpecialtiesFromDB = async() => {
    const result = await prisma.specialties.findMany();
    return result;
}

const deleteDataFromDB = async(id:string) => {
    const result = await prisma.specialties.delete({
        where:{
            id
        }
    })
    return result;
}

export const SpecialtiesServices = {
    insertIntoDB,
    getAllSpecialtiesFromDB,
    deleteDataFromDB
}