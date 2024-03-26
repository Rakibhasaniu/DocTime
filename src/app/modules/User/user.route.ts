import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { decodedToken } from "../../utils/decodedToken";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import auth from "../../middleware/auth";


const router = Router();

const auth = (...roles:string[]) => {
    return async(req:Request,res:Response,next:NextFunction) => {
        try {
            const token = req.headers.authorization
            if(!token){
                throw new Error("You are not authorized");
            }
            const verifiedUser = decodedToken.verifyToken(token,config.jwt.jwt_access_key as Secret)
            console.log(verifiedUser)
            if(roles.length && !roles.includes(verifiedUser.role)){
                throw new Error("You are not authorized");
            }
            next()
        } catch (err) {
            next(err);
        }
    }
}

router.post('/create-admin',auth("ADMIN","SUPER_ADMIN"),userController.createAdmin)


export const userRoutes = router;