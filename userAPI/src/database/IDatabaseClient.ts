import { UserDetails } from "../routes/controllers/userController";

export interface IDatabaseClient {
    createNewUser: (userDetails: UserDetails) => Promise<any>;
    getUserInfo: (id: string) => Promise<any>;
}