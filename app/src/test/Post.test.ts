import app from "../../app";
import request from "supertest";
import dataSource from "../db/dataSource";
import jwt from "jsonwebtoken";
import envConfig from "../config/DatabaseConfigurationConnection";

const token = jwt.sign({
    username: "test",
    password: "test"
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

describe("GET /api/auth/posts", () => {
    it("Should not get any posts without a token", async () => {
        await request(app)
            .get("/api/auth/posts")
            .expect(401)
            .then((res) => {
                expect(res.body).toEqual({});
            })
    })

    it("Should get all the available posts", async () => {
        await request(app)
            .get("/api/auth/posts")
            .set("Cookie", [`auth-token=${token}`])
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveLength(2);
            })
    })

    it("Should get all the available posts with an specific country", async () => {
        await request(app)
            .get("/api/auth/posts")
            .set("Cookie", [`auth-token=${token}`])
            .query({ country: "Spain" })
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveLength(2);
            })
    })

    it("Should get all the available posts with an specific city", async () => {
        await request(app)
            .get("/api/auth/posts")
            .set("Cookie", [`auth-token=${token}`])
            .query({ city: "Pollensa" })
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveLength(1);
            })
    })

    it("Should get all the available posts with an specific country and city", async () => {
        await request(app)
            .get("/api/auth/posts")
            .set("Cookie", [`auth-token=${token}`])
            .query({ country: "Spain", city: "Pollensa" })
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveLength(1);
            })
    })

    it("Should get all the available posts with an specific country and city and genre", async () => {
        await request(app)
            .get("/api/auth/posts")
            .set("Cookie", [`auth-token=${token}`])
            .query({ country: "Spain", city: "Pollensa", genres: ["Rock"] })
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveLength(1);
            })
    })

    it("Should get all the available posts with an specific region", async () => {
        await request(app)
            .get("/api/auth/posts")
            .set("Cookie", [`auth-token=${token}`])
            .query({ region: "Balearic Islands" })
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveLength(2);
            })
    });

    it("Should get all the available posts that have an specific music genre", async () => {
        await request(app)
            .get("/api/auth/posts")
            .set("Cookie", [`auth-token=${token}`])
            .query({ genres: ["Rock"] })
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveLength(2);
            })
    });

    it("Should return an empty list given a not existing genre in any post", async () => {
        await request(app)
            .get("/api/auth/posts")
            .set("Cookie", [`auth-token=${token}`])
            .query({ genres: ["Jazz"] })
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveLength(0);
            })
    });
})

describe("GET /api/auth/posts/:id", () => {
    it("Should get a post by id", async () => {
        await request(app)
            .get("/api/auth/posts/1")
            .set("Cookie", [`auth-token=${token}`])
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty("id", 1);
            })
    });

    it("Should return an error given a not existing post id", async () => {
        await request(app)
            .get("/api/auth/posts/91")
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
            .get("/api/auth/posts/abc")
            .set("Cookie", [`auth-token=${token}`])
            .expect(400)
            .then((res) => {
                expect(res.body).toEqual({
                    "error": "Invalid ID"
                });
            })
    })
})