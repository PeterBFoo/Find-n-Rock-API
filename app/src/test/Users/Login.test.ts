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

describe("POST /login", () => {
    it("Should get an auth-token", async () => {
        await request(app)
            .post("/api/login")
            .send({
                username: "user_test",
                password: "password"
            })
            .expect(200)
            .then((response) => {
                // assert that the response contains an auth-token as a cookie
                expect(response.header["set-cookie"][0]).toMatch(/auth-token/);
            });
    }, 1000);

    // expect to throw an error
    it("Should not get an auth-token", async () => {
        // send a wrong password
        await request(app)
            .post("/api/login")
            .send({
                username: "username",
                password: "wrong"
            })
            .expect(401)
            .then((response) => {
                // assert that the response does not contain an auth-token as a cookie
                expect(response.header["set-cookie"]).toBeUndefined();
            });
    }, 1000);

    it("Should log out", async () => {
        // log in
        const response = await request(app)
            .post("/api/login")
            .send({
                username: "user_test",
                password: "password"
            })
            .expect(200);

        // assert that the response contains an auth-token as a cookie
        expect(response.header["set-cookie"][0]).toMatch(/auth-token/);

        // log out
        await request(app)
            .post("/api/logout")
            .set("Cookie", response.header["set-cookie"])
            .expect(200)
            .then((response) => {
                // assert that the response does not contain an auth-token as a cookie
                expect(response.header["set-cookie"]).toContain("auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
            });
    }, 1000);

    it("Should not log out", async () => {
        // log out
        await request(app)
            .post("/api/logout")
            .expect(400)
            .then((response) => {
                // assert that the response does not contain an auth-token as a cookie
                expect(response.header["set-cookie"]).toBeUndefined();
            });
    }, 1000);
});