import { Admin, Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { searchAbleField } from "./admin.constant";
import calculatePagination from "../../../helpers/paginationHelpers";
import prisma from "../../../shared/prisma";




// [
//     {
//         name: {
//             contains:params.searchTerm,
//             mode: 'insensitive',
//         }
//     },
//     {
//         email:{
//             contains:params.searchTerm,
//             mode:'insensitive',
//         }
//     }
// ]

const getAllFromDB = async(params:any,options:any) => {
    const {limit,page,skip} = calculatePagination(options);
    const {searchTerm,...filterData} = params;
    const searchValue:Prisma.AdminWhereInput[] = [];
    
    if(params.searchTerm){
        searchValue.push({
            OR:searchAbleField.map((fieldName)=> ({
                [fieldName]:{
                    contains: params.searchTerm ,
                    mode: "insensitive" ,
                }
            }))
        })
    }
    if(Object.keys(filterData).length > 0){
        searchValue.push({
            AND:Object.keys(filterData).map((keyName)=>({
                [keyName]:{
                    equals: filterData[keyName],

                }
            }))
        
        })
    }
    //for soft delete filter
    searchValue.push({
        isDeleted:false,
    })

    const typeSolved:Prisma.AdminWhereInput = {AND:searchValue}


    const result = await prisma.admin.findMany({
        where:typeSolved,
        skip,
        take: limit, 
        orderBy:options.sortBy && options.sortOrder ? {
            [options.sortBy]:options.sortOrder
        }:{
            createdAt:'desc'
        }
    });

    const total=await prisma.admin.count({
        where:typeSolved
    })
    return {
        meta:{
            page,
            limit,
            total,
        },
        data:result,
    }
}
const getSingleDataFromDB = async(id:string):Promise<Admin | null> => {
    const result = await prisma.admin.findUnique({
        where:{
            id,
            isDeleted:false,
        }
    })
    return result;
}
const updateDataIntoDB = async(id:string,data: Partial<Admin>):Promise<Admin> => {
    await prisma.admin.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false,
        }
    })
    const result = await prisma.admin.update({
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
                status:UserStatus.BLOCKED
            }
        })
        return deleteAdmin;
    })
    return result;
    
}


export const AdminServices = {
    getAllFromDB,
    getSingleDataFromDB,
    updateDataIntoDB,
    deleteDataFromDB,
    softDeleteDataFromDB
}