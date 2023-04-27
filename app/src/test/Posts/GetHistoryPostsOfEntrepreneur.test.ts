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

describe("GET /api/auth/history/posts", () => {
    it("Should get the posts where the user is suscribed", async () => {
        // create a new user
        await request(app)
            .post("/api/register")
            .send({
                username: "new_entrepreneur",
                password: "new_entrepreneur",
                name: "name",
                description: "description",
                email: "new_entrepreneur@email.com",
                image: "image",
                address: "address",
                country: "country",
                phone: "phone",
                role: "entrepreneur"
            })
            .expect(200)

        let token = await request(app)
            .post("/api/login")
            .send({
                username: "new_entrepreneur",
                password: "new_entrepreneur"
            })
            .expect(200)
            .then((response) => {
                return response.body.token;
            });

        await request(app)
            .post("/api/auth/posts/create")
            .set("Cookie", [`auth-token=${token}`])
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

        // should only get the suscribed post
        await request(app)
            .get("/api/auth/history/posts")
            .set("Cookie", [`auth-token=${token}`])
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveLength(1);
            })
    })

    it("Should return an empty array because is not suscribed to any posts", async () => {
        // create a new user
        await request(app)
            .post("/api/register")
            .send({
                username: "another_entrepreneur",
                password: "another_entrepreneur",
                name: "name",
                description: "description",
                email: "another_entrepreneur@email.com",
                image: "image",
                address: "address",
                country: "country",
                phone: "phone",
                role: "entrepreneur"
            })
            .expect(200)

        let token = await request(app)
            .post("/api/login")
            .send({
                username: "another_entrepreneur",
                password: "another_entrepreneur"
            })
            .expect(200)
            .then((response) => {
                return response.body.token;
            });

        await request(app)
            .get("/api/auth/history/posts")
            .set("Cookie", [`auth-token=${token}`])
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual([]);
            });
    })
})