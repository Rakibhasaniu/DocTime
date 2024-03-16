import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllFromDB = async(params:any) => {
    const searchValue:Prisma.AdminWhereInput[] = [];
    if(params.searchTerm){
        searchValue.push({
            OR:[
                {
                    name: {
                        contains:params.searchTerm,
                        mode: 'insensitive',
                    }
                },
                {
                    email:{
                        contains:params.searchTerm,
                        mode:'insensitive',
                    }
                }
            ]
        })
    }

    const typeSolved:Prisma.AdminWhereInput = {AND:searchValue}


    const result = await prisma.admin.findMany({
        where:typeSolved
    });
    return result;

}


export const AdminServices = {
    getAllFromDB,
}