const request = require("supertest");
const app = require("./app");
const Model = require("./review/Model");
require("./db/mongoose");

beforeEach(async () => {
    await Model.deleteMany({});
});

describe("GET /", () => {
    it("Should response with 200 status code", async () => {
        let response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
    });
});

describe("POST /", () => {
    it("Should respond with 201 status code", async () => {
        let response = await request(app).post("/").send({
            name: "sam ouague",
            email: "hello@okok",
            comment: "Tres bien",
            rate: 5,
        });
        expect(response.statusCode).toBe(201);
    });
});

describe("DELETE /:id", () => {
    it("Should respond with 200 status code", async () => {
        let comment_id = (await request(app).post("/").send({
            name: "sam ouague",
            email: "hello@okok",
            comment: "Tres bien",
            rate: 5,
        })).body._id;
        let response = await request(app).delete(`/${comment_id}`);
        expect(response.statusCode).toBe(200);
    });
});