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
    if (dataSource.isInitialized) {
        await dataSource.destroy();
    }
});

describe("POST /api/auth/genres/create", () => {
    it("Should create a new genre", async () => {
        let admin = await request(app)
            .post("/api/login")
            .send({
                username: "admin",
                password: "admin"
            })
            .expect(200)
            .then((res) => {
                return res.body.token;
            });

        await request(app)
            .post("/api/auth/genres/create")
            .set('Cookie', [`auth-token=${admin}`])
            .send({
                name: "testGenre"
            })
            .expect(201)
            .then((res) => {
                expect(res.body.name).toBe("testGenre");
            })
    });

    it("Should not create a new genre if the user is not an admin", async () => {
        let user = await request(app)
            .post("/api/login")
            .send({
                username: "user_test",
                password: "password"
            })
            .expect(200)
            .then((res) => {
                return res.body.token;
            });

        await request(app)
            .post("/api/auth/genres/create")
            .set('Cookie', [`auth-token=${user}`])
            .send({
                name: "anotherTestGenre"
            })
            .expect(403)
    })

    it("Should not create a new genre if the genre already exists", async () => {
        let admin = await request(app)
            .post("/api/login")
            .send({
                username: "admin",
                password: "admin"
            })
            .expect(200)
            .then((res) => {
                return res.body.token;
            });

        await request(app)
            .post("/api/auth/genres/create")
            .set('Cookie', [`auth-token=${admin}`])
            .send({
                name: "testGenre"
            })
            .expect(400)
    })

    it("Should not create a new genre if the genre name is not provided", async () => {
        let admin = await request(app)
            .post("/api/login")
            .send({
                username: "admin",
                password: "admin"
            })
            .expect(200)
            .then((res) => {
                return res.body.token;
            });

        await request(app)
            .post("/api/auth/genres/create")
            .set('Cookie', [`auth-token=${admin}`])
            .send({
                name: ""
            })
            .expect(400)
    })
})