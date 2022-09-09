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

    it("Should be able list profile user",async () => {
        await request(app)
        .post("/api/v1/users")
        .send({
            name: "John Doe",
            email: "john.doe@gmail.com",
            password: "john@2022"
        })
        .expect(201); 

        const session =  await request(app)
        .post("/api/v1/sessions")
        .send({
            email: "john.doe@gmail.com",
            password: "john@2022"
        })
        .expect(200); 

        const { token } = session.body;

        const response = await request(app)
        .get("/api/v1/profile")
        .set({
            Authorization: `Bearer ${token as string}`, 
        })
        .expect(200);

        expect(response.body).toHaveProperty("id");
        expect(response.body.name).toMatch("John Doe");
        
    });
})