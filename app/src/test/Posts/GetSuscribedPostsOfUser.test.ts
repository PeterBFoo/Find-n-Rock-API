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

describe("GET /api/auth/posts/suscribed", () => {
    it("Should get all the posts where the user is suscribed", async () => {
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
            .get("/api/auth/suscribed/posts")
            .set("Cookie", [`auth-token=${userToken}`])
            .expect(200)
            .then((res) => {
                expect(res.body.length).toBe(0);
            });

        // suscribe to post
        await request(app)
            .post("/api/auth/posts/suscribe/1")
            .set("Cookie", [`auth-token=${userToken}`])
            .expect(200)

        // get suscribed posts
        await request(app)
            .get("/api/auth/suscribed/posts")
            .set("Cookie", [`auth-token=${userToken}`])
            .expect(200)
            .then((res) => {
                expect(res.body.length).toBe(1);
            });
    });
})