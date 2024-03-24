import express, { Application, Request, Response, urlencoded } from 'express';
import cors from 'cors';
import { userRoutes } from './app/modules/user/user.route';
import { AdminRoutes } from './app/modules/admin/admin.route';
import router from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';

const app:Application=express();
app.use(express.json());
app.use(urlencoded({extended:true}))
app.use(cors());

// app.use('/api/v1/user',userRoutes)
// app.use('/api/v1/admin',AdminRoutes)

app.get('/',(req:Request,res:Response)=>{
    res.send({
        Message:'DcoTime Server...'
    })
})
app.use('/api/v1',router)
app.use(globalErrorHandler)
app.use(notFound)

export default app;
