import mongoose from "mongoose";
import connectDB from "../helpers/db.js";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri(); // Use in-memory DB
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

test("MongoDB should connect successfully", async () => {
  expect(mongoose.connection.readyState).toBe(1); // 1 means connected
});