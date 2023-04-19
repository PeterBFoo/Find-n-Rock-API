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

describe("POST /api/auth/posts/delete/:id", () => {
    it("Should delete a post", async () => {
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

        let postId = await request(app)
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
            .then((res) => {
                return res.body.id
            });

        await request(app)
            .post(`/api/auth/posts/delete/${postId}`)
            .set("Cookie", [`auth-token=${userToken}`])
            .expect(200)
    });

    it("Should not delete a post because it's not the owner", async () => {
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

        let post = await request(app)
            .get("/api/auth/posts")
            .set("Cookie", [`auth-token=${userToken}`])
            .expect(200)
            .then((res) => {
                // return a post where the user is not the owner
                return res.body.find((post: any) => {
                    return post.user.username !== "username2"
                })
            });

        await request(app)
            .post(`/api/auth/posts/delete/${post.id}`)
            .set("Cookie", [`auth-token=${userToken}`])
            .expect(401)
    });

    it("Should not delete a post it doesn't exist", async () => {
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
            .post(`/api/auth/posts/delete/999999`)
            .set("Cookie", [`auth-token=${userToken}`])
            .expect(404)

    });
});