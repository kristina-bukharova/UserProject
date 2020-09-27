import UserController, { errors, UserDetails } from "../userController";
import { mockResponse, mockPostgresDatabaseConfig, mockGetRequestWithParams, mockUserData } from "../../../utils/mockObjects";
import PostgresDatabaseClient from "../../../database/postgresClient";
import { validate as uuidValidate } from 'uuid';

jest.mock("../../../database/postgresClient");
jest.mock("uuid");

describe("Get User Details", () => {
    let userController: UserController;
    let mockPostgresClient: PostgresDatabaseClient;
    let res: any;

    beforeAll(() => {
        mockPostgresClient = new PostgresDatabaseClient(mockPostgresDatabaseConfig);
        userController = new UserController(mockPostgresClient);
    });

    beforeEach(() => {
        jest.clearAllMocks();
        res = mockResponse();        
        (uuidValidate as unknown as jest.Mock).mockReturnValue(true);
    });

    it("responds with status 200 and return given user details when given a proper request", async () => {
        (mockPostgresClient.getUserInfo as jest.Mock).mockResolvedValue(mockUserData);
        const returnedUserDetails: UserDetails = {
            id: mockUserData.id,
            firstName: mockUserData.first_name,
            lastName: mockUserData.last_name,
            biographyTitle: mockUserData.biography_title,
        };

        const req: any = mockGetRequestWithParams({ id: "8e4958aa-8530-4014-bdf2-8edb7bba519a" });
        await userController.getUserDetails(req, res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(returnedUserDetails);
    });

    it("responds with status 400 when given an invalid id of type string", async () => {
        (uuidValidate as unknown as jest.Mock).mockReturnValue(false);
        const req: any = mockGetRequestWithParams({ id: "1234_my_id" });

        await userController.getUserDetails(req, res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(errors.invalidUUID);
    });


    it("responds with status 400 when given an invalid id of type number", async () => {
        (uuidValidate as unknown as jest.Mock).mockReturnValue(false);
        const req: any = mockGetRequestWithParams({ id: 451365 });

        await userController.getUserDetails(req, res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(errors.invalidUUID);
    });

    it("responds with status 404 when the given user does not exist", async () => {
        (mockPostgresClient.getUserInfo as jest.Mock).mockResolvedValue(null);

        const req: any = mockGetRequestWithParams({ id: "782e6b37-4c61-4845-9c25-bf718e875aac" });
        await userController.getUserDetails(req, res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(errors.userNotFound);
    });

    it("responds with status 500 when retrieving user info from the DB fails", async () => {
        const req: any = mockGetRequestWithParams({ id: "8e4958aa-8530-4014-bdf2-8edb7bba519a" });
        (mockPostgresClient.getUserInfo as jest.Mock).mockRejectedValue(new Error("DB error"));

        await userController.getUserDetails(req, res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith("DB error");
    });
});
