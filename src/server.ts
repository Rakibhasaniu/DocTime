import { Server } from 'http';
import app from './app'

async function main() {
    const server: Server = app.listen(3000, () => {
        console.log("Sever is running on port ", 3000);
    })
}

main();