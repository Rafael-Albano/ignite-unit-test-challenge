import request from "supertest"
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("List all Balance user", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able list all balance of the user",async () => {
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
        .get("/api/v1/statements/balance")
        .set({
            Authorization: `Bearer ${token as string}`, 
        })
        .expect(200);

        expect(response.body.statement.length).toBe(0);
        expect(response.body.balance).toBe(0);
        
    });
})