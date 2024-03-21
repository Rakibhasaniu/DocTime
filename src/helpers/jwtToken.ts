import jwt from 'jsonwebtoken';

const generateToken = (payload:any,secretKey: string,time:string) =>{
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

export default generateToken;