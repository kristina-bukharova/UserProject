import PostgresDatabaseClient from "../../../database/postgresClient";
import { mockPostgresDatabaseConfig, mockResponse } from "../../../testUtils/mockObjects";
import UserController from "../userController";
import { v4 as uuidv4 } from 'uuid';
import ToneRetriever from "../../../toneRetriever";

jest.mock("../../../database/postgresClient");
jest.mock("uuid");

describe("Get Unique ID", () => {
    let userController: UserController;
    let mockPostgresClient: PostgresDatabaseClient;
    let toneRetriever: ToneRetriever;
    let res: any;

    beforeAll(() => {
        mockPostgresClient = new PostgresDatabaseClient(mockPostgresDatabaseConfig);
        toneRetriever = new ToneRetriever("http://some-url.com");
        userController = new UserController(mockPostgresClient, toneRetriever);
    });

    beforeEach(() => {
        jest.clearAllMocks();
        res = mockResponse();
    });

    it("responds with status 200 and returns a uuid", async () => {
        (uuidv4 as unknown as jest.Mock).mockReturnValue("2e8ae507-e4cf-4c04-aac4-ab0019b9963d");

        const req: any = null;
        userController.getUniqueId(req, res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ id: "2e8ae507-e4cf-4c04-aac4-ab0019b9963d" });
    });
});
