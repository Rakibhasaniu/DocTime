import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import httpStatus from "http-status";
import { decodedToken } from "../utils/decodedToken";
import config from "../config";


const auth = (...roles: string[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization

            if (!token) {
                throw new Error( "You are not authorized!")
            }

            const verifiedUser = decodedToken.verifyToken(token, config.jwt.jwt_access_key as Secret)

            req.user = verifiedUser;

            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new Error( "You are not authorized!")
            }
            next()
        }
        catch (err) {
            next(err)
        }
    }
};

export default auth;