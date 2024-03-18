import { Admin, Prisma, PrismaClient } from "@prisma/client";
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
const getSingleDataFromDB = async(id:string) => {
    const result = await prisma.admin.findUnique({
        where:{
            id,
        }
    })
    return result;
}
const updateDataIntoDB = async(id:string,data: Partial<Admin>) => {
    await prisma.admin.findUniqueOrThrow({
        where:{
            id
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


export const AdminServices = {
    getAllFromDB,
    getSingleDataFromDB,
    updateDataIntoDB
}