import { PrismaClient } from "@prisma/client";


const getAllFromDB = async() => {
    const prisma = new PrismaClient();
    const result = await prisma.admin.findMany({});
    return result;

}


export const AdminServices = {
    getAllFromDB,
}