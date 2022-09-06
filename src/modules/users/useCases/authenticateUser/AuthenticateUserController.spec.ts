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

    it("Should be able authenticate user",async () => {
        await request(app)
        .post("/api/v1/users")
        .send({
            name: "John Doe",
            email: "john.doe@gmail.com",
            password: "john@2022"
        }); 

        const response = await request(app)
        .post("/api/v1/sessions")
        .send({
            email: "john.doe@gmail.com",
            password: "john@2022"
        });

        const { user } = response.body;

        expect(response.status).toBe(200);
        expect(user).toHaveProperty("id");
        expect(response.body).toHaveProperty("token");
    });

    it("Should not be able authenticate user if email incorrect",async () => {
        await request(app)
        .post("/api/v1/users")
        .send({
            name: "John Doe",
            email: "john.doe@gmail.com",
            password: "john@2022"
        }); 

        const response = await request(app)
        .post("/api/v1/sessions")
        .send({
            email: "jonh.doe@gmail.com",
            password: "john@2022"
        });

        const { user } = response.body;

        expect(response.status).toBe(401);
    });

    it("Should not be able authenticate user if password incorrect",async () => {
        await request(app)
        .post("/api/v1/users")
        .send({
            name: "John Doe",
            email: "john.doe@gmail.com",
            password: "john@2022"
        }); 

        const response = await request(app)
        .post("/api/v1/sessions")
        .send({
            email: "john.doe@gmail.com",
            password: "john@202"
        });

        const { user } = response.body;

        expect(response.status).toBe(401);
    })

})