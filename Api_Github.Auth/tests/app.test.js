import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";

let server;
beforeAll(() => {
  process.env.PORT = 3000;  // Use a different port
  server = app.listen(process.env.PORT);
});

afterAll(() => {
  server.close(); // Ensure server shuts down after tests
});


describe("Server API Tests", () => {

  test("GET / should return 'server on!!!'", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("server on!!!");
  });

  test("GET /auth/github should return 302 if route is redirected to github page", async () => {
    const res = await request(app).get("/auth/github");
    expect(res.statusCode).toBe(302);
  });

  test("GET /organizations should return 401 if route is unauthorised", async () => {
    const res = await request(app).get("/organizations");
    expect(res.statusCode).toBe(401);
  });

});

afterAll(async () => {
  await mongoose.disconnect();
});