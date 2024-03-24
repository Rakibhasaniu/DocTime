import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path:path.join(process.cwd(),'.env')});

export default {
    env:process.env.NODE_ENV,
    port:process.env.PORT,
    jwt:{
        jwt_access_key:process.env.ACCESS_SECRET,
        jwt_access_expires:process.env.ACCESS_EXPIRES_IN,
        jwt_refresh_key:process.env.REFRESH_SECRET,
        jwt_refresh_expires:process.env.REFRESH_EXPIRES_IN
    }    
}