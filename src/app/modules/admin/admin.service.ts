import { Admin, Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";
import calculatePagination from "../../utils/pagination";
import { TAdminFilterRequest } from "./admin.interface";
import { TPaginationOption } from "../../interface/pagination";

const prisma = new PrismaClient();

const getAllAdminFromDB = async(params:TAdminFilterRequest,option:TPaginationOption) => {
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
    const condition:Prisma.AdminWhereInput[] = [];
    if(params?.searchTerm){
        condition.push({
            OR:adminSearchAbleFields.map((field)=> ({
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
    condition.push({
        isDeleted:false
    })
    const arrayToObj:Prisma.AdminWhereInput ={AND:condition}
    const result = await prisma.admin.findMany({
        where:arrayToObj,
        skip,
        take:limit,
        orderBy:option.sortBy &&  option.orderBy ? {
            [option.sortBy]:option.sortOrder
        } : {
            createdAt:'desc'
        }
    });
    const total=await prisma.admin.count({
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
const getSingleAdmin = async(id:string):Promise<Admin | null> => {
    const result = await prisma.admin.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false
        }
    });
    return result;
}
const updateAdminDataFromDB = async(id:string,data:Partial<Admin>):Promise<Admin> => {
     await prisma.admin.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false
        }
    });
    const result = await  prisma.admin.update({
        where:{
            id
        },
        data
    })
    return result;
}
const deleteDataFromDB = async(id:string):Promise<Admin | null> => {
    await prisma.admin.findUniqueOrThrow({
        where:{
            id
        }
    })
    const result = await prisma.$transaction(async(deleteDataFromBoth) => {
        // 1. Delete from admin table
        const deleteAdmin = await deleteDataFromBoth.admin.delete({where:{id}});

        //2.Delete from user table
        await deleteDataFromBoth.user.delete({
            where:{
                email:deleteAdmin.email
            }
        })
        return deleteAdmin;
    })
    return result;
    
}
const softDeleteDataFromDB = async(id:string):Promise<Admin | null> => {
    await prisma.admin.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false,
        }
    })
    const result = await prisma.$transaction(async(deleteDataFromBoth) => {
        // 1. Delete from admin table
        const deleteAdmin = await deleteDataFromBoth.admin.update({
            where:{id},
            data:{isDeleted:true}
        });

        //2.Delete from user table
        await deleteDataFromBoth.user.update({
            where:{
                email:deleteAdmin.email
            },
            data:{
                status:UserStatus.DELETED
            }
        })
        return deleteAdmin;
    })
    return result;
    
}

export const AdminServices = {
     getAllAdminFromDB,
    getSingleAdmin,
    updateAdminDataFromDB,
    deleteDataFromDB,
    softDeleteDataFromDB

}