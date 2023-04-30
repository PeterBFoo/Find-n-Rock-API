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

describe("DELETE /api/auth/genres/delete/:name", () => {
    it("Should delete a genre", async () => {
        let admin = await request(app)
            .post("/api/login")
            .send({
                username: "admin",
                password: "admin"
            })
            .expect(200)
            .then((res) => {
                return res.body.token;
            });

        // create a new genre to delete
        await request(app)
            .post("/api/auth/genres/create")
            .set('Cookie', [`auth-token=${admin}`])
            .send({
                name: "newGenre"
            })
            .expect(201)

        await request(app)
            .delete("/api/auth/genres/delete/newGenre")
            .set('Cookie', [`auth-token=${admin}`])
            .expect(204)
    })

    it("Should not delete a genre if the user is not an admin", async () => {
        let user = await request(app)
            .post("/api/login")
            .send({
                username: "user_test",
                password: "password"
            })
            .expect(200)
            .then((res) => {
                return res.body.token;
            });

        await request(app)
            .delete("/api/auth/genres/delete/Rock")
            .set('Cookie', [`auth-token=${user}`])
            .expect(403)
    })

    it("Should not delete a genre if the genre does not exist", async () => {
        let admin = await request(app)
            .post("/api/login")
            .send({
                username: "admin",
                password: "admin"
            })
            .expect(200)
            .then((res) => {
                return res.body.token;
            });

        await request(app)
            .delete("/api/auth/genres/delete/nonExistentGenre")
            .set('Cookie', [`auth-token=${admin}`])
            .expect(404)
    })
})