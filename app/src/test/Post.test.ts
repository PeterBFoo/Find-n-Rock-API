import app from "../../app";
import request from "supertest";
import dataSource from "../db/dataSource";
import jwt from "jsonwebtoken";
import envConfig from "../config/DatabaseConfigurationConnection";

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

describe("POST /api/auth/posts/create", () => {
    it("Should get create a new post", async () => {
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
            .post("/api/auth/posts/create")
            .set("Cookie", [`auth-token=${userToken}`])
            .send({
                title: "New post",
                subtitle: "Subtitle post",
                body: "This is a test post",
                image: "https://test.com",
                genres: [
                    "Blues"
                ],
                country: "Spain",
                region: "Balearic Islands",
                city: "Alcudia"
            })
            .expect(201)
    });

    it("Should not create a new post because user is a musical group", async () => {
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
            .post("/api/auth/posts/create")
            .set("Cookie", [`auth-token=${userToken}`])
            .send({
                title: "New post",
                subtitle: "Subtitle post",
                body: "This is a test post",
                image: "https://test.com",
                genres: [
                    "Blues"
                ],
                country: "Spain",
                region: "Balearic Islands",
                city: "Alcudia"
            })
            .expect(401)
    });
})