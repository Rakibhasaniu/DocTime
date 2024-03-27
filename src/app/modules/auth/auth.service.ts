import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import generateToken from '../../utils/generateToken';
import { decodedToken } from '../../utils/decodedToken';
import { Prisma, PrismaClient, UserStatus } from '@prisma/client';
import config from '../../config';
import prisma from '../../utils/prisma';
import emailSender from './emailSender';



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
    return {
        accessToken,
        refreshToken,
        needPasswordChange:userData.needPasswordChange
    };
}

const refreshToken = async(token:string)=>{
    let decodedData;
    try {
         decodedData =decodedToken.verifyToken(token,config.jwt.jwt_refresh_key as Secret)
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

const changePassword = async(user:any,payload:any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where:{
            email:user.email,
            status:UserStatus.ACTIVE
        }
    })
    const isCorrectPassword:Boolean = await bcrypt.compareSync(payload.oldPassword, userData.password)
    if(!isCorrectPassword){
             throw new Error('Wrong Password')
        }
    const hashedPassword:string = await bcrypt.hash(payload.newPassword, 10);
    await prisma.user.update({
        where:{
            email:userData.email,
        },
        data:{
            password:hashedPassword,
            needPasswordChange:false
        }
    })
    return {
        message:"Password Changed Successfully"
    }
}

const forgotPassword = async(payload: {email:string}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where:{
            email:payload.email,
            status:UserStatus.ACTIVE
        }
    })
    const resetPasswordToken = generateToken(
        {email:userData.email,role:userData.role},
        config.jwt.reset_pass_key as Secret,
        '5m'
        );
        const resetPassword = config.reset_password_link + `?userId=${userData.id}&token=${resetPasswordToken}`;
        await emailSender(userData.email,
            `
            <div>
                <p>Dear User</p>
                <p>Your Password Reset Link 
                <a href=${resetPassword}>
                <button>
                Click Here To Reset Your Password
                </button>
                </a>
                 </p>
            </div>
            `
        )
        console.log(resetPassword)
}
export const AuthServices = {
    logInUser,
    refreshToken,
    changePassword,
    forgotPassword
}