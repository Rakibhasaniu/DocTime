import prisma from "../../../shared/prisma"
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import generateToken from "../../../helpers/jwtToken";



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
   const accessToken = generateToken({
    email:userData.email,
    role:userData.role,

   },
   'abcde','5m'
   )
   const refreshToken =generateToken({
    email:userData.email,
    role:userData.role,

   },
   'abcdefgh','30d'
   )

    // console.log(isCorrectPassword)
    return {
        accessToken,
        refreshToken,
        needPasswordChange:userData.needsPasswordChage

    };
}

export const AuthServices = {
    loginUser,
}