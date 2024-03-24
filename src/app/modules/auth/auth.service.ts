import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import prisma from '../../utils/prisma'
import bcrypt from 'bcrypt';
import generateToken from '../../utils/generateToken';
import { decodedToken } from '../../utils/decodedToken';
import { UserStatus } from '@prisma/client';
import config from '../../config';




const logInUser = async(payload:{
    email:string,
    password:string
}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where:{
            email:payload?.email,
            status:UserStatus.ACTIVE
        }
    })
    const isCorrectPassword:Boolean = await bcrypt.compareSync(payload.password, userData.password)
    if(!isCorrectPassword){
             throw new Error('Wrong Password')
        }
    const accessToken = generateToken({
        email:userData.email,
        role:userData.role
    },config.jwt.jwt_access_key as Secret,config.jwt.jwt_access_expires as string);
    const refreshToken =generateToken({
        email:userData.email,
        role:userData.role
    },
    config.jwt.jwt_refresh_key as Secret, 
    config.jwt.jwt_refresh_expires as string
    )
    

    // if(!isCorrectPassword){
    //     throw new Error('Wrong Password')
    // }else{
    //     //Generate JWT token  for the authenticated User 
    //     const token=jwt.sign({id:userData.id},process.env.JWT_SECRET as string ,{expiresIn:'1h'});
    //     return {
    //         ...userData,
    //         token
    //     };
    return {
        accessToken,
        refreshToken,
        needPasswordChange:userData.needPasswordChange
    };
}

const refreshToken = async(token:string)=>{
    let decodedData;
    try {
         decodedData =decodedToken.verifyToken(token,'abcdefgh')
    } catch (err) {
        throw new Error('You are not authorized')
    }
    const isUserExist = await prisma.user.findUniqueOrThrow({
        where:{
            email:decodedData?.email,
            status:UserStatus.ACTIVE
        }
    });
    const accessToken = generateToken({
        email:isUserExist?.email,
        role:isUserExist?.role
    },config.jwt.jwt_access_key as Secret,config.jwt.jwt_access_expires as string);
    return {
        accessToken,
        needPasswordChange:isUserExist?.needPasswordChange
    };
}

export const AuthServices = {
    logInUser,
    refreshToken
}