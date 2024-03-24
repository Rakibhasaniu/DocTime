import jwt, { JwtPayload, Secret } from 'jsonwebtoken'

const verifyToken =(token:string,secret:Secret) => {
    return jwt.verify(token,'abcdefgh') as JwtPayload;
}

export const decodedToken = { verifyToken};