import { PoolConfig } from "pg";

export const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

export const mockPostgresDatabaseConfig: PoolConfig = {
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "password",
    port: 4233,
}

export const mockUserData = {
    id: "8e4958aa-8530-4014-bdf2-8edb7bba519a",
    first_name: "Kristina",
    last_name: "Bukharova",
    biography_title: "Life really do be like that sometimes"
}

export const mockUserPostRequest = (id: any, firstName: any, lastName: any, biographyTitle: any) => {
    return {
        body: {
            id,
            firstName,
            lastName,
            biographyTitle,
        },
    };
};

export const mockAnyPostRequest = (requestBody: any) => {
    return {
        body: requestBody,
    };
};

export const mockGetRequestWithParams = (param: any) => {
    return {
        params: param,
    };
};
