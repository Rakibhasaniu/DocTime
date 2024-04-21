import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors'
import { UserRoutes } from './app/modules/user/user.route';
import { AdminRoutes } from './app/modules/admin/admin.route';
import router from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import httpStatus from 'http-status';

import cookieParser from 'cookie-parser';


const app:Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

app.get('/',(req:Request,res:Response)=>{
    res.send({
        message:'Server is running'
    })
})

app.use('/api/v1',router)
// app.use('/api/v1/',AdminRoutes)
app.use(globalErrorHandler)

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!"
        }
    })
})

export default app;