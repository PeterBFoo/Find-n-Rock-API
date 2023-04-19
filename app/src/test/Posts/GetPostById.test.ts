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

describe("GET /api/auth/post/:id", () => {
    it("Should get a post by id", async () => {
        await request(app)
            .get("/api/auth/post/1")
            .set("Cookie", [`auth-token=${token}`])
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty("id", 1);
            })
    });

    it("Should return an error given a not existing post id", async () => {
        await request(app)
            .get("/api/auth/post/91")
            .set("Cookie", [`auth-token=${token}`])
            .expect(404)
            .then((res) => {
                expect(res.body).toEqual({
                    "error": "Post not found"
                });
            })
    })

    it("Should return an error given a not valid post id", async () => {
        await request(app)
            .get("/api/auth/post/abc")
            .set("Cookie", [`auth-token=${token}`])
            .expect(400)
            .then((res) => {
                expect(res.body).toEqual({
                    "error": "Invalid ID"
                });
            })
    })
})