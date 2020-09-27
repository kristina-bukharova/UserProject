import Server from './server';
import Dotenv from "dotenv";
import UserController from './routes/controllers/userController';
import PostgresDatabaseClient from './database/postgresClient';
import { PoolConfig } from 'pg';
import ToneRetriever from './toneRetriever';

Dotenv.config();

const main = (() => {
    const appPort: number | undefined = Number(process.env.APP_PORT);
    const user: string | undefined = process.env.PG_USER;
    const host: string | undefined = process.env.PG_HOST;
    const password: string | undefined = process.env.PG_PASSWORD;
    const database: string | undefined = process.env.PG_DATABASE;
    const dbPort: number | undefined = Number(process.env.PG_PORT);
    const toneAPI: string | undefined = process.env.TONE_API;

    if (appPort && user && host && password && database && dbPort && toneAPI) {
        const postgresDatabaseConfig: PoolConfig = {
            user,
            host,
            database,
            password,
            port: dbPort,
        }
        const databaseClient = new PostgresDatabaseClient(postgresDatabaseConfig);
        const apiConnector = new ToneRetriever(toneAPI);
        const server: Server = new Server(
            appPort,
            [
                new UserController(databaseClient, apiConnector),
            ],
        );
        server.start();
    } else {
        console.log("Please provide a populated .env file");
    }
});
main();