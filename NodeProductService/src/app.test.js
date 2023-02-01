const app = require("./app");
const request = require("supertest");
const { CategoriesModel, ProductModel } = require("./products/Model");
require("./db/mongoose");

beforeEach(async () => {
    await CategoriesModel.deleteMany({});
    await ProductModel.deleteMany({});
});

describe("GET /category/:categoryTag", () => {
    it("Should respond with filtred docs", async () => {
        let response = await request(app).get("/category/green-tea");
        console.log(response.body);
    });

    it("Should respond with 200 status code", async () => {
        let response = await request(app).get("/category/green-tea");
        expect(response.statusCode).toBe(200);
    });

    it("Should respond with non-empty array", async () => {
        await request(app).post("/").send({
            title: "Biii Tea",
            weight: "500gr",
            price: "19.95",
            categoryTag: "Green Tea"
        });
        let response = await request(app).get("/category/green-tea");
        expect(response.body.prods.length > 0).toBe(true);
    });

    it("Should respond with 1 product", async () => {
        ["Black Tea", "Blue Tea", "Red Tea", "E Tea", "Zboub Tea", "Ice Tea", "Lol Tea"].forEach(async (v) => {
            await request(app).post("/").send({
                title: v,
                weight: "500gr",
                price: "19.95",
                categoryTag: "Green Tea"
            });
        });
        let response = await request(app).get("/category/green-tea?page=2");
        expect(response.body.prods.length == 1).toBe(true);
    });
});

describe("DELETE /", () => {
    it("Should respond with 200 status code", async () => {
        await request(app).post("/").send({
            title: "Green Tea",
            weight: "500gr",
            price: "19.95",
            categoryTag: "Green Tea"
        });
        let response = await request(app).delete("/").send({
            name: "Green Tea"
        });
        expect(response.statusCode).toBe(200);
    });
});

describe("POST /", () => {
    it("Should respond with 201 status code", async () => {
        let response = await request(app).post("/").send({
            title: "Green Tea",
            weight: "500gr",
            price: "19.95",
            categoryTag: "Green Tea"
        });
        expect(response.statusCode).toBe(201);
    });

    it("Should respond with non-empty array", async () => {
        await request(app).post("/").send({
            title: "Green Tea",
            weight: "500gr",
            price: "19.95",
            categoryTag: "Green Tea"
        });
        let response = await request(app).get("/");
        expect(response.body.prods.length > 0).toBe(true);
    });
});

describe("GET /categories", () => {
    it("Should respond with category and subcategory ", async () => {
        await request(app).post("/category").send({
            name: "Green Tea"
        });
        await request(app).post("/category/green-tea").send({
            name: "Category 1"
        });
        let response = await request(app).get("/categories");
        expect(response.body.length > 0 && response.body[0].subcategory.length > 0).toBe(true);
    });
});

describe("POST /category/:name", () => {
    it("Should respond with 200 status code", async () => {
        await request(app).post("/category").send({
            name: "Green Tea"
        });
        let response = await request(app).post("/category/green-tea").send({
            name: "Category 1"
        });
        expect(response.statusCode).toBe(201);
    });
});

describe("DELETE /category/:name", () => {
    it("Should respond with 200 status code", async () => {
        await request(app).post("/category").send({
            name: "Green Tea"
        });
        await request(app).post("/category/green-tea").send({
            name: "Category 1"
        });
        let response = await request(app).delete("/category/green-tea").send({
            name: "Category 1"
        });
        expect(response.statusCode).toBe(200);
    });
});

describe("DELETE /category", () => {
    it("Should respond with 200 status code", async () => {
        await request(app).post("/category").send({
            name: "Green Tea",
        });
        
        let response = await request(app).delete("/category").send({
            name: "Green Tea"
        });
        expect(response.statusCode).toBe(200);
    });

    it("Should respond with empty array", async () => {
        await request(app).post("/category").send({
            name: "Red Tea",
        });
        
        await request(app).delete("/category").send({
            name: "Red Tea"
        });
        let response = await request(app).get("/categories");
        expect(response.body.length === 0).toBe(true);
    });
});

describe("POST /category", () => {
    it("Should respond with 201 status code", async () => {
        let response = await request(app).post("/category").send({
            name: "Green Tea"
        });
        expect(response.statusCode).toBe(201);
    });

    it("Should respond with 400 status code", async () => {
        await request(app).post("/category").send({
            name: "Green Tea"
        });
        let response = await request(app).post("/category").send({
            name: "Green Tea"
        });
        expect(response.statusCode).toBe(400);
    });

    it("Should respond with 400 status code", async () => {
        let response = await request(app).post("/category").send();
        expect(response.statusCode).toBe(400);
    });
});

describe("GET /", () => {
    it("Should respond with 200 status code", async () => {
        let response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
    });
});