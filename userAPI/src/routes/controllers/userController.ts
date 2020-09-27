import Express from "express";
import { IDatabaseClient } from "../../database/IDatabaseClient";
import Route from "../route";
import { v4 as uuidv4 } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import ToneRetriever from "../../toneRetriever";

export type UserDetails = {
    id: string,
    firstName: string,
    lastName: string,
    biographyTitle: string,
    biographyTone?: string,
}

export const errors = {
    invalidUUID: "Please provide a valid uuid.",
    userNotFound: "No record exists for the given user ID.",
    invalidFields: "The request must contain the following fields: id, firstName, lastName, biographyTitle.",
    invalidTypes: "The id field must be a valid uuid, and firstName, lastName, and biographyTitle must be strings.",
};

export default class UserController extends Route {
    constructor(private databaseClient: IDatabaseClient, private toneRetriever: ToneRetriever) {
        super("/");
    }

    public initializeRoutes() {
        this.router.get("/id/", this.getUniqueId.bind(this));
        this.router.get("/user/:id/", this.getUserDetails.bind(this));
        this.router.post("/user/", this.createUser.bind(this));
    }

    public getUniqueId(request: Express.Request, response: Express.Response): Express.Response {
        const uuid: string = uuidv4();
        return response.status(200).json({ id: uuid });
    }

    public async getUserDetails(request: Express.Request, response: Express.Response): Promise<Express.Response> {
        const userId: string = request.params.id;

        if (!uuidValidate(userId)) {
            return response.status(400).send(errors.invalidUUID);
        }

        try {
            const tone = await this.toneRetriever.getTone();

            const dbRecord = await this.databaseClient.getUserInfo(userId);
            if (!dbRecord) {
                return response.status(404).send(errors.userNotFound);
            }
            const userDetails: UserDetails = {
                id: dbRecord.id,
                firstName: dbRecord.first_name,
                lastName: dbRecord.last_name,
                biographyTitle: dbRecord.biography_title,
                biographyTone: tone
            };
            return response.status(200).json(userDetails)
        } catch (err) {
            return response.status(500).send(err.message);
        }

    }

    public async createUser(request: Express.Request, response: Express.Response): Promise<Express.Response> {
        if (!request.body.id || !request.body.firstName || !request.body.lastName || !request.body.biographyTitle) {
            return response.status(400).send(errors.invalidFields);
        }

        if (!uuidValidate(request.body.id) || typeof request.body.firstName !== "string" ||
            typeof request.body.lastName !== "string" || typeof request.body.biographyTitle !== "string") {
            return response.status(400).send(errors.invalidTypes);
        }

        const newUser: UserDetails = {
            id: request.body.id,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            biographyTitle: request.body.biographyTitle,
        }

        try {
            const newUserId = await this.databaseClient.createNewUser(newUser);
            return response.status(201).json({ id: newUserId });
        } catch (err) {
            return response.status(500).send(err.message);
        }
    }
}