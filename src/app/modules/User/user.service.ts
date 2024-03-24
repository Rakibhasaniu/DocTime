import {  PrismaClient, UserRole } from "@prisma/client"
import bcrypt  from 'bcrypt';

const prisma = new PrismaClient();

const createAdminIntoDB = async(payload:any) => {
    const hashedPassword:string = await bcrypt.hash(payload.password, 10);
    // console.log(payload)
    const userData = {
        email:payload.admin.email,
        password:hashedPassword,
        role:UserRole.ADMIN
    }

    const result = await prisma.$transaction(async(transac)=> {
        await transac.user.create({
            data:userData
        })
        const createAdmin = await transac.admin.create({
            data:payload.admin
        })
        return createAdmin;
    })
    return result;
}

export const userServices ={
    createAdminIntoDB
}