let request = require("supertest");
let app = require("./app");
let Model = require("./contact/Model");
require("./db/mongoose");

beforeEach(async () => {
    await Model.deleteMany({});
});

describe("GET /", () => {
    it("Should respond with 200 status code", async () => {
        let response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
    });
});

describe("GET /:id", () => {
    it("Should respond with 200 status code", async () => {
        let response = await request(app).get("/123");
        expect(response.statusCode).toBe(404);
    });
});

describe("GET /", () => {
    it("Should respond with 201 status code", async () => {
        let response = await request(app).post("/").send({
            name: "Sam O",
            email: "sam@test.com",
            subject: "",
            message: "Hello"
        });
        expect(response.statusCode).toBe(201);
    });
    
    it("Should respond with 201 status code", async () => {
        await request(app).post("/").send({
            name: "Sam O",
            email: "sam@test.com",
            subject: "",
            message: "Hello"
        });
        let response = await request(app).get("/");
        expect(typeof response.body).toBe("object");
    });
});