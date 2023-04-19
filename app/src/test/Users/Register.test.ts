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

describe("POST /register", () => {
    // register a new user
    it("Should register a new entrepreneur user", async () => {
        await request(app)
            .post("/api/register")
            .send({
                username: "test",
                password: "test_user",
                name: "name",
                description: "description",
                email: "test@email.com",
                image: "image",
                address: "address",
                country: "country",
                phone: "phone",
                role: "entrepreneur"
            })
            .expect(200)
            .then((response) => {
                // assert that the response contains the new user
                expect(response.body).toMatchObject({
                    username: "test",
                    password: response.body.password, // this is the hashed password
                    name: "name",
                    description: "description",
                    email: "test@email.com",
                    image: "image",
                    address: "address",
                    country: "country",
                    phone: "phone",
                    role: response.body.role // role id
                });
            });
    }, 1000);

    it("Should register a new musical group user", async () => {
        await request(app)
            .post("/api/register")
            .send({
                username: "musical_group",
                password: "test_user",
                name: "name",
                description: "description",
                email: "mg@email.com",
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
            .then((response) => {
                // assert that the response contains the new user
                expect(response.body).toMatchObject({
                    username: "musical_group",
                    password: response.body.password, // this is the hashed password
                    name: "name",
                    description: "description",
                    email: "mg@email.com",
                    image: "image",
                    address: "address",
                    country: "country",
                    phone: "phone",
                    role: response.body.role, // role id
                    integrants: 4,
                    musicalGenres: response.body.musicalGenres
                });
                expect(response.body.musicalGenres).toHaveLength(2)
            });
    }, 1000);

    it("Should not register an existing user", async () => {
        await request(app)
            .post("/api/register")
            .send({
                username: "test2",
                password: "test_user",
                name: "name",
                description: "description",
                email: "tes2t@email.com",
                image: "image",
                address: "address",
                country: "country",
                phone: "phone",
                integrants: 4,
                role: "group"
            }).expect(200);

        await request(app)
            .post("/api/register")
            .send({
                username: "test2",
                password: "test_user",
                name: "name",
                description: "description",
                email: "tes2t@email.com",
                image: "image",
                address: "address",
                country: "country",
                phone: "phone",
                integrants: 4,
                role: "group"
            })
            .expect(400)
            .then((response) => {
                // assert that the response contains the new user
                expect(response.body.error).toContain("User already exists")
            });
    }, 1000);

    it("Should not accept user register when parameters are missing", async () => {
        await request(app)
            .post("/api/register")
            .send({
                username: "test",
                name: "name",
                email: "test@email.com",
                image: "image",
                address: "address",
                country: "country",
                phone: "phone",
                role: "group"
            })
            .expect(400)
            .then((response) => {
                // assert that the response contains the new user
                expect(response.body.error).toContain("Invalid data")
            });
    }, 1000);
});
