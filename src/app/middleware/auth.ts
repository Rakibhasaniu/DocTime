import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import httpStatus from "http-status";
import { jwtHelpers } from "../utils/jwtHelpers";
import config from "../config";
import ApiError from "../errors/appError";


const auth = (...roles: string[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            // console.log('tok',token)

            if (!token) {
                throw new ApiError( httpStatus.UNAUTHORIZED,"You are not authorized!")
            }

            const verifiedUser = jwtHelpers.verifyToken(token, config.jwt.jwt_secret as Secret)
            // console.log('v',verifiedUser)

            req.user = verifiedUser;

            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new ApiError( httpStatus.FORBIDDEN,"Forbidden")
            }
            next()
        }
        catch (err) {
            next(err)
        }
    }
};

export default auth;