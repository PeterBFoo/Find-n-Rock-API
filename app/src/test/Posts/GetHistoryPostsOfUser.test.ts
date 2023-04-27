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
                username: "new_user",
                password: "new_user",
                name: "name",
                description: "description",
                email: "mg222@email.com",
                image: "image",
                address: "address",
                country: "country",
                phone: "phone",
                role: "group",
                integrants: 4,
                musicalGenres: [
                    "Blues",
                    "Rock"
                ]
            })
            .expect(200)

        let token = await request(app)
            .post("/api/login")
            .send({
                username: "new_user",
                password: "new_user"
            })
            .expect(200)
            .then((response) => {
                return response.body.token;
            });

        await request(app)
            .post("/api/auth/posts/suscribe/1")
            .set("Cookie", [`auth-token=${token}`])
            .expect(200)

        // should only get the suscribed post
        await request(app)
            .get("/api/auth/history/posts")
            .set("Cookie", [`auth-token=${token}`])
            .expect(200)
            .then((res) => {
                expect(res.body[0].id).toEqual(1);
            })
    })

    it("Should return an empty array because is not suscribed to any posts", async () => {
        // create a new user
        await request(app)
            .post("/api/register")
            .send({
                username: "another_user",
                password: "another_user",
                name: "name",
                description: "description",
                email: "musicalgroup@email.com",
                image: "image",
                address: "address",
                country: "country",
                phone: "phone",
                role: "group",
                integrants: 4,
                musicalGenres: [
                    "Blues",
                    "Rock"
                ]
            })
            .expect(200)

        let token = await request(app)
            .post("/api/login")
            .send({
                username: "another_user",
                password: "another_user"
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