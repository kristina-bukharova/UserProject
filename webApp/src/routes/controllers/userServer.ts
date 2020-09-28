import Express from "express";
import Route from "../route";
import UserAPI, { UserDetails } from "../../userApi";
import { firstNames, lastNames, biographyTitles } from "../../utils/sampleData";

export default class UserServer extends Route {
    private users: UserDetails[] = [];

    constructor(private userApi: UserAPI) {
        super("/");
    }

    public initializeRoutes() {
        this.router.get("/", this.renderUserInfoTable.bind(this));
    }

    public async renderUserInfoTable(request: Express.Request, response: Express.Response) {
        await this.addNewUserToList();
        return response.render('users.ejs', { users: this.users });
    }

    public async addNewUserToList() {
        try {
            const uuid = await this.userApi.getNewId();
            const randomNewUser = {
                id: uuid,
                firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
                lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
                biographyTitle: biographyTitles[Math.floor(Math.random() * biographyTitles.length)]
            }
            await this.userApi.createNewUser(randomNewUser)
            const userData = await this.userApi.getUserInfo(uuid);
            this.users.push(userData);
        } catch (err) {
            console.log(err.message);
        }
    }
}