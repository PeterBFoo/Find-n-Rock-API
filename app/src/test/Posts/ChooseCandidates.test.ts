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

describe("POST /api/auth/post/choose/:postId", () => {
    it("Should choose a candidate to a post", async () => {
        // get musical group token
        let mgToken = await request(app)
            .post("/api/login")
            .send({
                username: "username2",
                password: "password2"
            })
            .expect(200)
            .then((res) => {
                return res.body.token
            });

        // get entrepreneour token
        let entrepreneourToken = await request(app)
            .post("/api/login")
            .send({
                username: "user_test",
                password: "password"
            })
            .expect(200)
            .then((res) => {
                return res.body.token
            });

        // create a new post
        let post = await request(app)
            .post("/api/auth/posts/create")
            .set("Cookie", [`auth-token=${entrepreneourToken}`])
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
                return res.body;
            })

        // suscribe to the post
        await request(app)
            .post("/api/auth/posts/suscribe/" + post.id)
            .set("Cookie", [`auth-token=${mgToken}`])
            .expect(200)

        // choose the candidate between the suscribed users 
        await request(app)
            .post("/api/auth/post/choose/" + post.id)
            .set("Cookie", [`auth-token=${entrepreneourToken}`])
            .send({
                candidates: ["username2"]
            })
            .expect(200)
            .then((res) => {
                expect(res.body[0].username).toEqual("username2")
            })
    });

    it("Should not choose candidates because the post doesn't exist", async () => {
        let entrepreneourToken = await request(app)
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
            .post("/api/auth/post/choose/9382673")
            .set("Cookie", [`auth-token=${entrepreneourToken}`])
            .send({
                candidates: ["username2"]
            })
            .expect(404)
    })

    it("Should not choose candidates because is not the post post owner", async () => {
        let postOwnerToken = await request(app)
            .post("/api/login")
            .send({
                username: "user_test",
                password: "password"
            })
            .expect(200)
            .then((res) => {
                return res.body.token
            });

        let anotherEntrepreneourToken = await request(app)
            .post("/api/login")
            .send({
                username: "user_without_posts",
                password: "password"
            })
            .expect(200)
            .then((res) => {
                return res.body.token
            });

        let mgToken = await request(app)
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
            .post("/api/auth/posts/create")
            .set("Cookie", [`auth-token=${postOwnerToken}`])
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
                return res.body;
            })

        // suscribe to the post
        await request(app)
            .post("/api/auth/posts/suscribe/" + post.id)
            .set("Cookie", [`auth-token=${mgToken}`])
            .expect(200)


        await request(app)
            .post("/api/auth/post/choose/" + post.id)
            .set("Cookie", [`auth-token=${anotherEntrepreneourToken}`])
            .send({
                candidates: ["username2"]
            })
            .expect(401)
    })

    it("Should not choose candidates because the payload is empty", async () => {
        let mgToken = await request(app)
            .post("/api/login")
            .send({
                username: "username2",
                password: "password2"
            })
            .expect(200)
            .then((res) => {
                return res.body.token
            });

        let entrepreneourToken = await request(app)
            .post("/api/login")
            .send({
                username: "user_test",
                password: "password"
            })
            .expect(200)
            .then((res) => {
                return res.body.token
            });

        let post = await request(app)
            .post("/api/auth/posts/create")
            .set("Cookie", [`auth-token=${entrepreneourToken}`])
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
                return res.body;
            })

        await request(app)
            .post("/api/auth/posts/suscribe/" + post.id)
            .set("Cookie", [`auth-token=${mgToken}`])
            .expect(200)

        await request(app)
            .post("/api/auth/post/choose/" + post.id)
            .set("Cookie", [`auth-token=${entrepreneourToken}`])
            .expect(400)
    })

    it("Should not choose a candidate because the candidate isn't suscribed", async () => {
        let mgToken = await request(app)
            .post("/api/login")
            .send({
                username: "username2",
                password: "password2"
            })
            .expect(200)
            .then((res) => {
                return res.body.token
            });

        let entrepreneourToken = await request(app)
            .post("/api/login")
            .send({
                username: "user_test",
                password: "password"
            })
            .expect(200)
            .then((res) => {
                return res.body.token
            });

        let post = await request(app)
            .post("/api/auth/posts/create")
            .set("Cookie", [`auth-token=${entrepreneourToken}`])
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
                return res.body;
            })

        await request(app)
            .post("/api/auth/posts/suscribe/" + post.id)
            .set("Cookie", [`auth-token=${mgToken}`])
            .expect(200)

        await request(app)
            .post("/api/auth/post/choose/" + post.id)
            .set("Cookie", [`auth-token=${entrepreneourToken}`])
            .send({
                candidates: [
                    "user_not_suscribed"
                ]
            })
            .expect(400)
    })
});