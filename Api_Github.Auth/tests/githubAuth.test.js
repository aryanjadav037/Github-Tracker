import request from "supertest";
import mongoose from "mongoose";
import {app} from "../app.js"; // Your Express app
import { MongoMemoryServer } from "mongodb-memory-server";
import GithubUser from "../models/githubUser.js";
import { jest } from "@jest/globals";
import dotenv from "dotenv";
import axios from "axios";

jest.mock("axios");
dotenv.config();

let server;
let mongoServer;

beforeAll(async () => {
  process.env.PORT = 3003;  // Use a different port
  server = app.listen(process.env.PORT); // Run on a different port

  axios.post = jest.fn();
  axios.get = jest.fn();

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();


  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  if (mongoose.connection.readyState === 0) { // Prevent multiple connections
    await mongoose.connect(mongoUri);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

describe("GitHub OAuth Callback", () => {
  it("should return a valid access token and store user details", async () => {
    const mockToken = "mock_access_token";
    const mockUser = {
      id: "123456",
      login: "testuser",
      email: "test@example.com",
      avatar_url: "https://example.com/avatar.png",
    };

    // Mock GitHub API responses
    axios.post.mockResolvedValue({ data: { access_token: mockToken } });
    axios.get.mockResolvedValue({ data: mockUser });

    const res = await request(app).get("/auth/github/callback?code=valid_code");

    expect(res.status).toBe(302); // Expect redirect on success
    expect(res.headers["set-cookie"]).toBeDefined(); // Check if cookie is set

    // Verify user is stored in DB
    const savedUser = await GithubUser.findOne({ github_id: mockUser.id });
    expect(savedUser).toBeDefined();
    expect(savedUser.username).toBe(mockUser.login);
    expect(savedUser.access_token).toBe(mockToken);
  });

  it("should return 400 if the authorization code is missing", async () => {
    const res = await request(app).get("/auth/github/callback"); // No code parameter
  
    expect(res.status).toBe(400); // Expect 400 Bad Request
    expect(res.body).toHaveProperty("error", "Authorization code missing");
  });  

});