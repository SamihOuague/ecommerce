const app = require("./app");
const request = require("supertest");

describe("POST /upload", () => {
    it("Should respond with 200 status code", async () => {
        let response = await request(app).post("/upload").send({
            img: "data:image/png;base64,iVBOR"
        });
        expect(response.statusCode).toBe(200);
    });
});