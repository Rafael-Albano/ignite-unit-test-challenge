import request from "supertest"
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Create User Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able create new user", async () => {
        const response = await request(app)
        .post("/api/v1/users")
        .send({
            name: "Jhon Doe",
            email: "john.doe@gmail.com",
            password: "john@2022"
        });

        expect(response.status).toBe(201);
    });

    it("Should not be able create new user with same email", async () => {
        await request(app)
        .post("/api/v1/users")
        .send({
            name: "John Doe",
            email: "john.doe@gmail.com",
            password: "john@2022"
        }); 

        const response = await request(app)
        .post("/api/v1/users")
        .send({
            name: "Jane Doe",
            email: "john.doe@gmail.com",
            password: "jane@2022"
        });

        expect(response.status).toBe(400);
    });
})