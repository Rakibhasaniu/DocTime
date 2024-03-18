import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { UserRoutes } from './app/modules/User/user.route';
import { AdminRoutes } from './app/modules/admin/admin.route';
import router from './app/routes/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app:Application = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

// app.use('/api/v1/user',UserRoutes)
// app.use('/api/v1/admin',AdminRoutes);

app.use('/api/v1',router)


app.get('/',(req:Request,res:Response)=> {
    res.send({
        Message:'DocTime Server....!!'
    })
})

app.use(globalErrorHandler)

export default app;