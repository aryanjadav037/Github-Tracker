import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test("should connect to the in-memory database", async () => {
  expect(mongoose.connection.readyState).toBe(1); // 1 means connected
});
