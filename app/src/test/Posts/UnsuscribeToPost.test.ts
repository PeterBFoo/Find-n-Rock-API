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

describe("POST /api/auth/posts/unsuscribe/:id", () => {
    it("Should unsuscribe to a post", async () => {
        let login = await request(app)
            .post("/api/login")
            .send({
                username: "username2",
                password: "password2"
            })
            .expect(200)
            .then((res) => {
                return res.body
            });

        // assert before doing the unsuscribe, that is really suscribed
        await request(app)
            .post("/api/auth/posts/suscribe/2")
            .set("Cookie", [`auth-token=${login.token}`])

        await request(app)
            .post("/api/auth/posts/unsuscribe/2")
            .set("Cookie", [`auth-token=${login.token}`])
            .expect(200)
    });

    it("Should not unsuscribe to the a post because is already not suscribed", async () => {
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

        // assert that is really unsuscribed, unsuscribing first to be sure of the response type
        await request(app)
            .post("/api/auth/posts/unsuscribe/2")
            .set("Cookie", [`auth-token=${userToken}`])

        await request(app)
            .post("/api/auth/posts/unsuscribe/2")
            .set("Cookie", [`auth-token=${userToken}`])
            .expect(400)
    });

    it("Should not unsuscribe to the a post because it's an entrepreneour'", async () => {
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
            .post("/api/auth/posts/unsuscribe/2")
            .set("Cookie", [`auth-token=${userToken}`])
            .expect(401)
    });
})