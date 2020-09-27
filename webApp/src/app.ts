import Server from './server';
import Dotenv from "dotenv";
import UserServer from './routes/controllers/userServer';
import UserRetriever from './userRetriever';

Dotenv.config();

const main = (() => {
    const userAPI: string | undefined = process.env.USER_API;
    const appPort: number | undefined = Number(process.env.APP_PORT);

    if (userAPI && appPort) {
        const apiConnector = new UserRetriever(userAPI);
        const server: Server = new Server(
            appPort,
            [
                new UserServer(apiConnector),
            ],
        );
        server.start();
    } else {
        console.log("Please provide a populated .env file");
    }
});
main();