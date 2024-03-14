import { PrismaClient, UserRole } from "@prisma/client"

const prisma = new PrismaClient();

const createAdminInDB = async(data:any) => {
    const UserData = {
        email:data.admin.email, 
        password: data.password,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async(transactionClient) => {
        const createUser = await transactionClient.user.create({
            data: UserData
        })
        const createAdmin = await transactionClient.admin.create({
            data:data.admin
        })
        return createAdmin;
    })
    
    return result;
}


export const UserService = {
    createAdminInDB
}