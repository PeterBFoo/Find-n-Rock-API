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

describe("POST /api/auth/posts/edit/:id", () => {
    it("Should edit an existing post", async () => {
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
            })

        await request(app)
            .post("/api/auth/posts/edit/" + postId)
            .set("Cookie", [`auth-token=${userToken}`])
            .send({
                title: "Changed!",
                subtitle: "Changed!",
                body: "This is a test post",
                image: "https://test.com",
                genres: [],
                country: "Sweeden",
                region: "Balearic Islands",
                city: "Alcudia"
            })
            .expect(200)
            .then((res) => {
                expect(res.body.title).toEqual("Changed!")
                expect(res.body.subtitle).toEqual("Changed!")
                expect(res.body.genres).toHaveLength(0)
                expect(res.body.country).toEqual("Sweeden")
            })
    });

    it("Should not edit the post because he's not the owner of the post", async () => {
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

        let postId = await request(app)
            .get("/api/auth/posts/user_test")
            .set("Cookie", [`auth-token=${userToken}`])
            .expect(200)
            .then((res) => {
                return res.body.map((post: { id: any; }) => {
                    return post.id
                })
            })

        await request(app)
            .post("/api/auth/posts/edit/" + postId[0])
            .set("Cookie", [`auth-token=${userToken}`])
            .send({
                title: "Edit post",
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