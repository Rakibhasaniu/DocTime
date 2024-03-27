import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import httpStatus from "http-status";
import { decodedToken } from "../utils/decodedToken";
import config from "../config";
import AppError from "../errors/AppError";


const auth = (...roles: string[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization

            if (!token) {
                throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!")
            }

            const verifiedUser = decodedToken.verifyToken(token, config.jwt.jwt_access_key as Secret)
            // console.log(verifiedUser)

            req.user = verifiedUser;

            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new AppError(httpStatus.FORBIDDEN, "Forbidden!")
            }
            next()
        }
        catch (err) {
            next(err)
        }
    }
};

export default auth;