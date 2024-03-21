import prisma from "../../../shared/prisma"
import * as bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import generateToken, { verifyToken } from "../../../helpers/jwtToken";
import { UserStatus } from "@prisma/client";



const loginUser =async (payload:{
    email:string,
    password:string
}) =>{
    const userData = await prisma.user.findUniqueOrThrow({
        where:{
            email:payload.email,
            status:UserStatus.ACTIVE
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

const refreshToken = async(token: string)=> {
    let decodeData;
    try {
         decodeData = verifyToken(token,'abcdefgh')

    } catch (err) {
        throw new Error("You are not authorized")
    }
    const isUserExist = await prisma.user.findUniqueOrThrow({
        where:{
            email:decodeData?.email,
            status:UserStatus.ACTIVE

        }
    })
    const accessToken = generateToken({
        email:isUserExist?.email,
        role:isUserExist?.role,
    
       },
       'abcde','5m'
       )
       return {
        accessToken,
        
        needPasswordChange:isUserExist?.needsPasswordChage

    };
}
export const AuthServices = {
    loginUser,
    refreshToken
}