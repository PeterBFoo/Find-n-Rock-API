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

describe("GET /api/genres", () => {
    it("Should get all the available genres", async () => {
        await request(app)
            .get("/api/genres")
            .expect(200)
            .then((res) => {
                expect(res.body.length).toBeGreaterThanOrEqual(1);
            })
    });
})