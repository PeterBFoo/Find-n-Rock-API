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
    if (dataSource.isInitialized) await dataSource.destroy();
});

describe("POST /api/auth/profile/edit", () => {
    it("Should edit the information of the entrepreneur", async () => {
        await request(app)
            .post("/api/register")
            .send({
                username: "editProfileTest",
                password: "editProfileTest",
                name: "name",
                description: "description",
                email: "testtesttestemail@email.com",
                image: "image",
                address: "address",
                country: "country",
                phone: "phone",
                role: "entrepreneur"
            })

        let userToken = await request(app)
            .post("/api/login")
            .send({
                username: "editProfileTest",
                password: "editProfileTest"
            })
            .expect(200)
            .then((res) => {
                return res.body.token
            });

        await request(app)
            .post("/api/auth/profile/edit")
            .set("Cookie", [`auth-token=${userToken}`])
            .send({
                username: "should_not_change",
                password: "new-password",
                name: "Changed!",
                description: "Changed!",
                email: "changed@test.com",
                country: "Changed!",
                image: "Changed!",
                address: "Changed!",
                phone: "Changed!",
            })
            .expect(200)
            .then((res) => {
                expect(res.body.username).toEqual("editProfileTest")
                expect(res.body.name).toEqual("Changed!")
                expect(res.body.description).toEqual("Changed!")
                expect(res.body.country).toEqual("Changed!")
                expect(res.body.address).toEqual("Changed!")
                expect(res.body.image).toEqual("Changed!")
                expect(res.body.phone).toEqual("Changed!")
                expect(res.body.email).toEqual("changed@test.com")
            })

        await request(app)
            .post("/api/login")
            .send({
                username: "editProfileTest",
                password: "new-password"
            })
            .expect(200)
    })

    it("Should edit the information of the music group", async () => {
        await request(app)
            .post("/api/register")
            .send({
                username: "mg_edit_test",
                password: "mg_edit_test",
                name: "name",
                description: "description",
                email: "mgedittest@email.com",
                image: "image",
                address: "address",
                country: "country",
                phone: "phone",
                role: "group",
                integrants: 4,
                musicalGenres: [
                    "Rock"
                ]
            })

        let userToken = await request(app)
            .post("/api/login")
            .send({
                username: "mg_edit_test",
                password: "mg_edit_test"
            })
            .expect(200)
            .then((res) => {
                return res.body.token
            });

        await request(app)
            .post("/api/auth/profile/edit")
            .set("Cookie", [`auth-token=${userToken}`])
            .send({
                username: "should_not_change",
                name: "Changed!",
                description: "Changed!",
                email: "Changed!Changed!@email.com",
                image: "Changed!",
                address: "Changed!",
                country: "Changed!",
                phone: "Changed!",
                integrants: 2,
                genres: [
                    "Rock",
                    "Blues"
                ]
            })
            .expect(200)
            .then((res) => {
                expect(res.body.username).toEqual("mg_edit_test")
                expect(res.body.name).toEqual("Changed!")
                expect(res.body.description).toEqual("Changed!")
                expect(res.body.country).toEqual("Changed!")
                expect(res.body.address).toEqual("Changed!")
                expect(res.body.image).toEqual("Changed!")
                expect(res.body.phone).toEqual("Changed!")
                expect(res.body.email).toEqual("Changed!Changed!@email.com")

                expect(res.body.musicalGenres).toHaveLength(2)
            })

        await request(app)
            .post("/api/login")
            .send({
                username: "mg_edit_test",
                password: "mg_edit_test"
            })
            .expect(200)
    })
});