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

describe("POST /api/auth/posts/suscribe/:id", () => {
    it("Should suscribe to the a post", async () => {
        let userToken = await request(app)
            .post("/api/login")
            .send({
                username: "username2",
                password: "password2"
            })
            .expect(200)
            .then((res) => {
                return res.body.token
            });

        await request(app)
            .post("/api/auth/posts/suscribe/2")
            .set("Cookie", [`auth-token=${userToken}`])
            .expect(200)
            .then((res) => {
                expect(res.body.suscriptions).toHaveLength(1)
            })
    });

    it("Should not suscribe to the a post because is already suscribed", async () => {
        let userToken = await request(app)
            .post("/api/login")
            .send({
                username: "username2",
                password: "password2"
            })
            .expect(200)
            .then((res) => {
                return res.body.token
            });

        await request(app)
            .post("/api/auth/posts/suscribe/2")
            .set("Cookie", [`auth-token=${userToken}`])
            .expect(400)
    });

    it("Should not suscribe to the a post because it's an entrepreneour'", async () => {
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
            .post("/api/auth/posts/suscribe/2")
            .set("Cookie", [`auth-token=${userToken}`])
            .expect(401)
    });
})