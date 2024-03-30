import {  Admin, Doctor, Patient, Prisma, PrismaClient, User, UserRole } from "@prisma/client"
import bcrypt  from 'bcrypt';
import { fileUploader } from "../../utils/fileUploader";
import { IUploadFile } from "../../interface/file";
import { Request } from "express";
import { TPaginationOption } from "../../interface/pagination";
import calculatePagination from "../../utils/pagination";
import { userSearchAbleFields } from "./user.constant";

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

const getAllUserFromDB = async(params:any,option:TPaginationOption) => {
    // [
    //     {
    //         name:{
    //             contains: query?.searchTerm,
    //             mode:'insensitive'
    //         }
    //     },{
    //         email:{
    //             contains:query?.searchTerm,
    //             mode:"insensitive"
    //         }
    //     }
    // ]
    const {limit,page,skip} =calculatePagination(option);
    const {searchTerm,...filterData} = params;
    const condition:Prisma.UserWhereInput[] = [];
    if(params?.searchTerm){
        condition.push({
            OR:userSearchAbleFields.map((field)=> ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }
    if(Object.keys(filterData).length > 0){
        condition.push({
            AND:Object.keys(filterData).map((key) => ({
                [key]:{
                    equals:(filterData as any)[key],
                    
                }
            }))
        })
    }
    
    const arrayToObj:Prisma.UserWhereInput =condition.length > 0 ? {AND:condition}:{};
    const result = await prisma.user.findMany({
        where:arrayToObj,
        skip,
        take:limit,
        orderBy:option.sortBy &&  option.sortOrder ? {
            [option.sortBy]:option.sortOrder
        } : {
            createdAt:'desc'
        },
        select:{
            id:true,
            email:true,
            role:true,
            needPasswordChange:true,
            status:true,
            createdAt:true,
            updatedAt:true
        }
    });
    const total=await prisma.user.count({
        where:arrayToObj
    })
    return {
        meta:{
            page,
            limit,
            total
        },

        data:result
    };
}

const changeProfileStatus= async(id:string,status:UserRole)=>{
    const userData = await prisma.user.findUniqueOrThrow({
        where:{
            id
        }
    })

    const updateUserStatus = await prisma.user.update({
        where:
        {
            id
        },
        data:status
    })
    return updateUserStatus

}


export const userServices ={
    createAdminIntoDB,
    createDoctorIntoDB,
    createPatientIntoDB,
    getAllUserFromDB,
    changeProfileStatus
}
