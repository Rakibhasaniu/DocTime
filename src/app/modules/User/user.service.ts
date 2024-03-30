import {  Admin, Doctor, Patient, PrismaClient, UserRole } from "@prisma/client"
import bcrypt  from 'bcrypt';
import { fileUploader } from "../../utils/fileUploader";
import { IUploadFile } from "../../interface/file";
import { Request } from "express";

const prisma = new PrismaClient();

const createAdminIntoDB = async(req:Request):Promise<Admin> => {
    const file = req.file as IUploadFile;
    if(file){
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.admin.profilePhoto=uploadToCloudinary?.secure_url
        // console.log(req.body)
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
const createDoctorIntoDB = async(req:Request):Promise<Doctor> => {
    const file = req.file as IUploadFile;
    if(file){
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.doctor.profilePhoto=uploadToCloudinary?.secure_url
        // console.log(req.body)
    }
    const hashedPassword:string = await bcrypt.hash(req.body.password, 10);
    // console.log(payload)
    const userData = {
        email:req.body.doctor.email,
        password:hashedPassword,
        role:UserRole.DOCTOR
    }

    const result = await prisma.$transaction(async(transac)=> {
        await transac.user.create({
            data:userData
        })
        const createDoctor = await transac.doctor.create({
            data:req.body.doctor
        })
        return createDoctor;
    })
    return result;
}

const createPatientIntoDB  = async (req: Request): Promise<Patient> => {
    // console.log('service',req.body)
    const file = req.file as IUploadFile;

    if (file) {
        const uploadedProfileImage = await fileUploader.uploadToCloudinary(file);
        req.body.patient.profilePhoto = uploadedProfileImage?.secure_url;
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req?.body?.patient?.email,
        password: hashedPassword,
        role: UserRole.PATIENT
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdPatientData = await transactionClient.patient.create({
            data: req.body.patient
        });

        return createdPatientData;
    });

    return result;
};
export const userServices ={
    createAdminIntoDB,
    createDoctorIntoDB,
    createPatientIntoDB
}
