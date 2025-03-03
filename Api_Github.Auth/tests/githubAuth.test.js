import request from "supertest";
import app from "../app.js"; // Import Express app
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import GithubUser from "../models/githubUser.js";

// Mock environment variables
process.env.GITHUB_CLIENT_ID = "Ov23lilep0JX2Nso8Cfr";
process.env.GITHUB_CLIENT_SECRET = "541ff882ffbcee9952aad3218e2880fa09004802";

let mongoServer;

beforeAll(async () => {
    // Start In-Memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Ensure Mongoose is not already connected
    await mongoose.disconnect();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    // Properly close Mongoose connection and stop in-memory MongoDB
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe("GitHub OAuth Routes", () => {
    test("GET /auth/github - Redirect to GitHub OAuth", async () => {
        const response = await request(app).get("/auth/github");
        expect(response.status).toBe(302); // 302 for redirection
        expect(response.headers.location).toContain("https://github.com/login/oauth/authorize");
    });

    test("GET /auth/github/callback - Missing authorization code", async () => {
        const response = await request(app).get("/auth/github/callback");
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Authorization code missing");
    });

    test("GET /auth/github/callback - Invalid authorization code", async () => {
        const response = await request(app).get("/auth/github/callback?code=invalidcode");
        expect(response.status).toBe(400);
    });
});
