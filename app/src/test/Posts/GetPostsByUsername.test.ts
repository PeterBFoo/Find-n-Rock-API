import app from "../../../app";
import request from "supertest";
import dataSource from "../../db/dataSource";
import jwt from "jsonwebtoken";
import envConfig from "../../config/DatabaseConfigurationConnection";

const token = jwt.sign({
    username: "user_test",
    password: "password",
    role: {
        canManagePosts: true
    },
    id: 1
}, envConfig.getSecretKey());

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

describe("GET /api/auth/posts/:username", () => {
    it("Should get all the posts of the user 'user_test'", async () => {
        await request(app)
            .get("/api/auth/posts/user_test")
            .set("Cookie", [`auth-token=${token}`])
            .expect(200)
            .then((res) => {
                expect(res.body.length).toBeGreaterThan(0);
            })
    });

    it("Should get any posts of the user 'user_without_posts'", async () => {
        await request(app)
            .get("/api/auth/posts/user_without_posts")
            .set("Cookie", [`auth-token=${token}`])
            .expect(200)
            .then((res) => {
                expect(res.body.length).toEqual(0);
            })
    });

    it("Should respond with 404 because user doesn't exist", async () => {
        await request(app)
            .get("/api/auth/posts/nonexisting_user")
            .set("Cookie", [`auth-token=${token}`])
            .expect(404);
    });
})