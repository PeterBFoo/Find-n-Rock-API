import app from "../../../app";
import request from "supertest";
import dataSource from "../../db/dataSource";

beforeAll(async () => {
    // connect to the database
    if (!dataSource.isInitialized) {
        await dataSource.initialize();
    }
});

afterAll(async () => {
    // close the database connection
    if (dataSource.isInitialized) await dataSource.destroy();
});

describe("GET /api/auth/get/experiences", () => {

    it("should return 200 OK", async () => {
        let userToken = await request(app)
            .post("/api/login")
            .send({
                username: "admin",
                password: "admin"
            })
            .expect(200)
            .then((res) => {
                return res.body.token
            });

        const response = await request(app)
            .get("/api/auth/get/experiences")
            .set("Cookie", [`auth-token=${userToken}`])


        expect(response.status).toBe(200);
    });

    it("should return 200 OK", async () => {
        let userToken = await request(app)
            .post("/api/login")
            .send({
                username: "admin",
                password: "admin"
            })
            .expect(200)
            .then((res) => {
                return res.body.token
            });

        const response = await request(app)
            .post("/api/auth/create/experience")
            .set("Cookie", [`auth-token=${userToken}`])
            .send({
                name: "Software Engineer",
                enterprise: "Google",
                country: "United States",
                region: "California",
                city: "Mountain View",
                initialDate: "06/22/2018",
                endDate: "06/22/2020",
                description: "I worked on the Google search engine."
            });

        expect(response.status).toBe(201);

        const response2 = await request(app)
            .get("/api/auth/get/experiences")
            .set("Cookie", [`auth-token=${userToken}`])

        expect(response2.status).toBe(200);
        expect(response2.body.length).toBeGreaterThanOrEqual(1);
    });
});