import { Server } from 'http';
import app from './src/app';


const port =3000;


async function main(){
    const server:Server = app.listen(port,() => {
        console.log(`App is listening on port ${port}`)
    })
}
main();

