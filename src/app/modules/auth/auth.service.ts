import prisma from "../../../shared/prisma"
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const loginUser =async (payload:{
    email:string,
    password:string
}) =>{
    const userData = await prisma.user.findUniqueOrThrow({
        where:{
            email:payload.email
        }
    })
    const isCorrectPassword:boolean = await bcrypt.compare(payload.password,userData.password);
    if(!isCorrectPassword){
        throw new Error("Password incorrect")
    }
   const accessToken = jwt.sign({
    email:userData.email,
    role:userData.role
   },
   "abcdefg",
   {
    algorithm:'HS256',
    expiresIn:'15m'
   }
   )

    // console.log(isCorrectPassword)
    return {
        accessToken,
        needPasswordChange:userData.needsPasswordChage

    };
}

export const AuthServices = {
    loginUser,
}