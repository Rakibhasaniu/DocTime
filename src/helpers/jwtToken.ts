import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const generateToken = (payload:any,secretKey: Secret,time:string) =>{
    const token = jwt.sign(
        payload,
        secretKey,
        {
            algorithm:'HS256',
            expiresIn:time
        }
    )
    return token;
}
export const verifyToken =(token:string,secretKey:Secret)=>{
    return jwt.verify(token,secretKey) as JwtPayload;
}

export default generateToken;