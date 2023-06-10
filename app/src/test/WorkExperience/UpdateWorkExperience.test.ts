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

describe("POST /api/auth/create/experience", () => {

    it("should return 201 OK", async () => {
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

        const res = await request(app)
            .put("/api/auth/update/experience/" + response.body.id)
            .set("Cookie", [`auth-token=${userToken}`])
            .send({
                name: "Updated Engineer",
                enterprise: "Google",
                country: "United States",
                region: "California",
                city: "Mountain View",
                initialDate: "06/22/2018",
                endDate: "06/22/2020",
                description: "I worked on the Google search engine."
            }).expect(200);

        expect(res.body.name).toBe("Updated Engineer");
    });

    it("should return 400 Bad Request", async () => {

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

        await request(app)
            .put("/api/auth/update/experience/" + response.body.id)
            .set("Cookie", [`auth-token=${userToken}`])
            .send({
                name: "Updated Engineer",
                enterprise: "Google",
                country: "United States",
                region: "California",
                city: "Mountain View",
                initialDate: "06/22/2018",
                endDate: "06/22/2020",
            }).expect(400);
    });

    it("should return 404", async () => {
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

        await request(app)
            .put("/api/auth/update/experience/999999999999999999999999")
            .set("Cookie", [`auth-token=${userToken}`])
            .send({
                name: "Updated Engineer",
                enterprise: "Google",
                country: "United States",
                region: "California",
                city: "Mountain View",
                initialDate: "06/22/2018",
                endDate: "06/22/2020",
                description: "I worked on the Google search engine."
            }).expect(404);
    });
});