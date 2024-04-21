import { Admin, Prisma, PrismaClient, UserStatus } from "@prisma/client"
import { adminSearchAbleFields } from "./admin.constant";
import { paginationHelper } from "../../utils/paginationHelpers";
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationOptions } from "../../interface/pagination";

const prisma = new PrismaClient();
const getAllAdminFromDB = async(params:IAdminFilterRequest,options:IPaginationOptions) => {
    // [
    //     {
    //         name:{
    //             contains:params.searchTerm,
    //             mode:'insensitive'
    //         }
    //     },
    //     {
    //         email:{
    //             contains:params.searchTerm,
    //             mode:'insensitive'
    //         }
    //     }
    // ]
    const {limit,page,skip} = paginationHelper.calculatePagination(options);
    const {searchTerm,...filterData} = params;
    const andConditions:Prisma.AdminWhereInput[]=[];
    
    if(params.searchTerm){
        andConditions.push(
            {
                OR:adminSearchAbleFields.map((field) => ({
                    [field]:{
                        contains:params.searchTerm,
                        mode:'insensitive'
                    }
                }))
            }
        )
    }
    if(Object.keys(filterData).length > 0){
        andConditions.push({
            AND:Object.keys(filterData).map((key) => ({
                [key]:{
                    equals:(filterData as any)[key]
                }
            }))
        })
    }
    andConditions.push({
        isDeleted: false
    })


    const condition:Prisma.AdminWhereInput = {AND: andConditions}

    const result = await prisma.admin.findMany({
        where:condition,
        skip:(Number(page-1) * limit),
        take: Number(limit),
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });
    const total = await prisma.admin.count({
        where: condition
    });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
}

const getSingleAdmin = async(id:any):Promise<Admin | null> => {
    const result = await prisma.admin.findUnique({
        where:{
            id,
            isDeleted:false
        }
    })
    return result;
}
const updateIntoDB = async (id: string, data: Partial<Admin>): Promise<Admin> => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    const result = await prisma.admin.update({
        where: {
            id
        },
        data
    });

    return result;
};
const deleteFromDB = async (id: string): Promise<Admin | null> => {

    await prisma.admin.findUniqueOrThrow({
        where: {
            id
        }
    });

    const result = await prisma.$transaction(async (transactionClient) => {
        const adminDeletedData = await transactionClient.admin.delete({
            where: {
                id
            }
        });

        await transactionClient.user.delete({
            where: {
                email: adminDeletedData.email
            }
        });

        return adminDeletedData;
    });

    return result;
}


const softDeleteFromDB = async (id: string): Promise<Admin | null> => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    const result = await prisma.$transaction(async (transactionClient) => {
        const adminDeletedData = await transactionClient.admin.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        });

        await transactionClient.user.update({
            where: {
                email: adminDeletedData.email
            },
            data: {
                status: UserStatus.DELETED
            }
        });

        return adminDeletedData;
    });

    return result;
}

export const AdminService = {
    getAllAdminFromDB,
    getSingleAdmin,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
}