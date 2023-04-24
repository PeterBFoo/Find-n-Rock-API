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

describe("POST /api/auth/posts/create", () => {
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
            .send(["username2"])
            .expect(200)
            .then((res) => {
                expect(res.body[0].username).toEqual("username2")
            })
    });
});