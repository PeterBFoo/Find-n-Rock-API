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

describe("GET /api/auth/profile/:username", () => {
    it("Should get the user that is in the request from the database", async () => {
        let userToken = await request(app)
            .post("/api/login")
            .send({
                username: "user_test",
                password: "password"
            })
            .expect(200)
            .then((res) => {
                return res.body.token
            });

        await request(app)
            .get("/api/auth/profile/admin")
            .set("Cookie", [`auth-token=${userToken}`])
            .expect(200)
            .then((res) => {
                expect(res.body.username).toEqual("admin")
            })
    })

    it("Should return 404 if the user is not found", async () => {
        let userToken = await request(app)
            .post("/api/login")
            .send({
                username: "user_test",
                password: "password"
            })
            .expect(200)
            .then((res) => {
                return res.body.token
            });

        await request(app)
            .get("/api/auth/profile/invalid")
            .set("Cookie", [`auth-token=${userToken}`])
            .expect(404)
    });
});