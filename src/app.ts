import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { UserRoutes } from './app/modules/User/user.route';

const app:Application = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use('/api/v1/user',UserRoutes)


app.get('/',(req:Request,res:Response)=> {
    res.send({
        Message:'DocTime Server....!!'
    })
})

export default app;