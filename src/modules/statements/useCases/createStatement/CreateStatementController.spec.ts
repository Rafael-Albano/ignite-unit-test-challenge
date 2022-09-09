import request from "supertest"
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Create Statement Balance", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able create statement of type deposit in user account",async () => {
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
        .post("/api/v1/statements/deposit")
        .send({
            amount: 250,
            description: "PIX"
        })
        .set({
            Authorization: `Bearer ${token as string}`, 
        })
        .expect(201);

        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("user_id");
    });

    it("Should be able create statement of type withdraw in user account",async () => {
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

        await request(app)
        .post("/api/v1/statements/deposit")
        .send({
            amount: 250,
            description: "PIX"
        })
        .set({
            Authorization: `Bearer ${token as string}`, 
        })
        .expect(201);

        const response = await request(app)
        .post("/api/v1/statements/withdraw")
        .send({
            amount: 50,
            description: "Transference"
        })
        .set({
            Authorization: `Bearer ${token as string}`, 
        })
        .expect(201);

        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("user_id");
        
    });
})