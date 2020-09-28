import UserController, { errors } from "../userController";
import { mockResponse, mockPostgresDatabaseConfig, mockUserData, mockUserPostRequest, mockAnyPostRequest } from "../../../testUtils/mockObjects";
import PostgresDatabaseClient from "../../../database/postgresClient";
import { validate as uuidValidate } from 'uuid';
import ToneAPI from "../../../toneApi";

jest.mock("../../../database/postgresClient");
jest.mock("uuid");

describe("Create User", () => {
    let userController: UserController;
    let mockPostgresClient: PostgresDatabaseClient;
    let toneApi: ToneAPI;
    let res: any;

    beforeAll(() => {
        mockPostgresClient = new PostgresDatabaseClient(mockPostgresDatabaseConfig);
        toneApi = new ToneAPI("http://some-url.com");
        userController = new UserController(mockPostgresClient, toneApi);
    });

    beforeEach(() => {
        jest.clearAllMocks();
        res = mockResponse();
        (uuidValidate as unknown as jest.Mock).mockReturnValue(true);
    });

    it("responds with status 201 and returns the created user's id when given a proper request", async () => {
        (mockPostgresClient.createNewUser as jest.Mock).mockResolvedValue("8e4958aa-8530-4014-bdf2-8edb7bba519a");

        const req: any = mockUserPostRequest(mockUserData.id, mockUserData.first_name, mockUserData.last_name, mockUserData.biography_title);
        await userController.createUser(req, res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ id: mockUserData.id });
    });

    it("responds with status 400 when given an invalid id", async () => {
        (uuidValidate as unknown as jest.Mock).mockReturnValue(false);
        const req: any = mockUserPostRequest("1234-sdf2-b32-s", mockUserData.first_name, mockUserData.last_name, mockUserData.biography_title);

        await userController.createUser(req, res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(errors.invalidTypes);
    });


    it("responds with status 400 when given an invalid first name", async () => {
        const req: any = mockUserPostRequest(mockUserData.id, 918398924, mockUserData.last_name, mockUserData.biography_title);

        await userController.createUser(req, res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(errors.invalidTypes);
    });

    it("responds with status 400 when given an invalid last name", async () => {
        const req: any = mockUserPostRequest(mockUserData.id, mockUserData.first_name, 11, mockUserData.biography_title);

        await userController.createUser(req, res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(errors.invalidTypes);
    });

    it("responds with status 400 when given an invalid biography title", async () => {
        const req: any = mockUserPostRequest(mockUserData.id, mockUserData.first_name, mockUserData.last_name, 7331);

        await userController.createUser(req, res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(errors.invalidTypes);
    });

    it("responds with status 400 when given a request with missing id field", async () => {
        const req: any = mockAnyPostRequest({ firstName: mockUserData.first_name, lastName: mockUserData.last_name, biographyTitle: mockUserData.biography_title });

        await userController.createUser(req, res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(errors.invalidFields);
    });

    it("responds with status 400 when given a request with missing first name field", async () => {
        const req: any = mockAnyPostRequest({ id: mockUserData.id, lastName: mockUserData.last_name, biographyTitle: mockUserData.biography_title });

        await userController.createUser(req, res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(errors.invalidFields);
    });

    it("responds with status 400 when given a request with missing last name field", async () => {
        const req: any = mockAnyPostRequest({ id: mockUserData.id, firstName: mockUserData.first_name, biographyTitle: mockUserData.biography_title });

        await userController.createUser(req, res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(errors.invalidFields);
    });

    it("responds with status 400 when given a request with missing biography field", async () => {
        const req: any = mockAnyPostRequest({ id: mockUserData.id, firstName: mockUserData.first_name, lastName: mockUserData.last_name });

        await userController.createUser(req, res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(errors.invalidFields);
    });

    it("responds with status 500 when writing user info to the DB fails", async () => {
        const req: any = mockUserPostRequest(mockUserData.id, mockUserData.first_name, mockUserData.last_name, mockUserData.biography_title);
        (mockPostgresClient.createNewUser as jest.Mock).mockRejectedValue(new Error("DB error"));

        await userController.createUser(req, res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith("DB error");
    });
});
