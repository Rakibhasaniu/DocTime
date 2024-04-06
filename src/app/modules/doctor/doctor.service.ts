import { Admin, Doctor, Prisma, PrismaClient, UserStatus } from "@prisma/client";
import calculatePagination from "../../utils/pagination";
import { TPaginationOption } from "../../interface/pagination";
import { doctorSearchableFields } from "./doctor.constant";

const prisma = new PrismaClient();

const getAllDoctorFromDB = async(params:any,option:TPaginationOption) => {
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
    const condition:Prisma.DoctorWhereInput[] = [];
    if(params?.searchTerm){
        condition.push({
            OR:doctorSearchableFields.map((field)=> ({
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
    // condition.push({
    //     isDeleted:false
    // })
    const arrayToObj:Prisma.DoctorWhereInput ={AND:condition}
    const result = await prisma.doctor.findMany({
        where:arrayToObj,
        skip,
        take:limit,
        orderBy:option.sortBy &&  option.sortBy ? {
            [option.sortBy]:option.sortOrder
        } : {
            createdAt:'desc'
        }
    });
    const total=await prisma.doctor.count({
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
const getSingleDoctor = async(id:string):Promise<Doctor | null> => {
    const result = await prisma.doctor.findUniqueOrThrow({
        where:{
            id,
            // isDeleted:false
        }
    });
    return result;
}
const updateDoctorDataFromDB = async(id:string,payload:any) => {
    const {specialties,...data}=payload;
    console.log(specialties,data)
     await prisma.doctor.findUniqueOrThrow({
        where:{
            id,
            // isDeleted:false
        }
    });

    const result = await prisma.$transaction(async(transactionClient)=>{
        const updateDoctor = await  transactionClient.doctor.update({
            where:{
                id
            },
            data,
            include:{
                doctorSpecialties:true
            }
        })
        for(const specialtiesId of specialties){
            const createDoctorSpecialties = await transactionClient.doctorSpecialties.create({
                data:{
                    doctorId:updateDoctor.id,
                    specialtiesId:specialtiesId
                }
            })
        }
        return updateDoctor
    })

    
    return result;
}
const deleteDataFromDB = async(id:string):Promise<Doctor | null> => {
    await prisma.doctor.findUniqueOrThrow({
        where:{
            id
        }
    })
    const result = await prisma.$transaction(async(deleteDataFromBoth) => {
        // 1. Delete from admin table
        const deleteData = await deleteDataFromBoth.doctor.delete({where:{id}});

        //2.Delete from user table
        await deleteDataFromBoth.user.delete({
            where:{
                email:deleteData.email
            }
        })
        return deleteData;
    })
    return result;
    
}
// const softDeleteDataFromDB = async(id:string):Promise<Doctor | null> => {
//     await prisma.doctor.findUniqueOrThrow({
//         where:{
//             id,
//             // isDeleted:false,
//         }
//     })
//     const result = await prisma.$transaction(async(deleteDataFromBoth) => {
//         // 1. Delete from admin table
//         const deleteAdmin = await deleteDataFromBoth.doctor.update({
//             where:{id},
//             data:{isDeleted:true}
//         });

//         //2.Delete from user table
//         await deleteDataFromBoth.user.update({
//             where:{
//                 email:deleteAdmin.email
//             },
//             data:{
//                 status:UserStatus.DELETED
//             }
//         })
//         return deleteAdmin;
//     })
//     return result;
    
// }

export const DoctorServices = {
    getAllDoctorFromDB,
    getSingleDoctor,
    updateDoctorDataFromDB,
    deleteDataFromDB,
    // softDeleteDataFromDB

}