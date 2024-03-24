import jwt, { Secret } from 'jsonwebtoken'

const generateToken = (payload:any,secretKey:Secret,expiresIn:string) => {
    const token = jwt.sign(
        payload,
        secretKey,{
        algorithm:'HS256',
        expiresIn
        }
    )
    return token;
}


export default generateToken;
