import Server from './server';
import Dotenv from "dotenv";
import UserServer from './routes/controllers/userServer';
import UserAPI from './userApi';

Dotenv.config();

const main = (() => {
    const userAPI: string | undefined = process.env.USER_API;
    const appPort: number | undefined = Number(process.env.APP_PORT);

    if (userAPI && appPort) {
        const userApi = new UserAPI(userAPI);
        const server: Server = new Server(
            appPort,
            [
                new UserServer(userApi),
            ],
        );
        server.start();
    } else {
        console.log("Please provide a populated .env file");
    }
});
main();