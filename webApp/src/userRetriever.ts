import axios from "axios";

export type UserDetails = {
    id: string,
    firstName: string,
    lastName: string,
    biographyTitle: string,
    biographyTone?: string,
}

export default class UserRetriever {
    constructor(private endpoint: string) {
    }

    public async getUserInfo(id: string): Promise<UserDetails> {
        try {
            const result = await axios.get(this.endpoint + "/user/" + id);
            return result.data;
        } catch (err) {
            throw new Error(`Could not retrieve user from User API. ${err.message}.`);
        }
    }

    public async getNewId(): Promise<string> {
        try {
            const result = await axios.get(this.endpoint + "/id/");
            return result.data.id;
        } catch (err) {
            throw new Error(`Could not generate a uuid from the User API. ${err.message}.`);
        }
    }

    public async createNewUser(user: UserDetails): Promise<string> {
        try {
            const result = await axios.post(this.endpoint + "/user/", user);
            return result.data.id;
        } catch (err) {
            throw new Error(`Could not create a new user using the User API. ${err.message}.`);
        }
    }
}
