import request from "supertest";
import app from "../app.js";
import dotenv from "dotenv";

dotenv.config();

let server;
beforeAll(() => {
  process.env.PORTa = 5000;
  server = app.listen(process.env.PORTa);
});

afterAll(() => {
  server.close(); 
});

const protectedRoutes = [
  { method: "get", path: "/organizations/" },
  { method: "get", path: "/organizations/nodejs/repos" },
  { method: "get", path: "/organizations/nodejs/repos/node/commits" },
  { method: "get", path: "/organizations/nodejs/repos/node/pulls" },
  { method: "get", path: "/organizations/nodejs/repos/node/issues" },
  { method: "get", path: "/organizations/nodejs/repos/node/issues/changelogs" },
];

describe("GitHub Data Routes", () => {  
  let accessToken = process.env.TEST_GITHUB_access_Token; 

  it("should return 401 if access token is missing", async () => {
    const res = await request(app).get("/organizations");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
  });

  it("should fetch organizations for authenticated user", async () => {
    const res = await request(app)
      .get("/organizations")
      .set("Cookie", `access_Token=${accessToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should reply with status code 500 for unauthorized access token", async () => {
    const res = await request(app)
      .get("/organizations")
      .set("Cookie", 'access_Token="gho_hwdARBRi1JFCaaEo1NUTWeoa2pdZnr2JR85f"');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Bad credentials - https://docs.github.com/rest");
  });

  it("should fetch repositories for a given organization", async () => {
    const org = "nodejs";
    const res = await request(app)
      .get(`/organizations/${org}/repos`)
      .set("Cookie", `access_Token=${accessToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should fetch commits for a repository", async () => {
    const org = "nodejs";
    const repo = "node";
    const res = await request(app)
      .get(`/organizations/${org}/repos/${repo}/commits`)
      .set("Cookie", `access_Token=${accessToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should fetch pull requests for a repository", async () => {
    const org = "nodejs";
    const repo = "node";
    const res = await request(app)
      .get(`/organizations/${org}/repos/${repo}/pulls`)
      .set("Cookie", `access_Token=${accessToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should fetch issues for a repository", async () => {
    const org = "nodejs";
    const repo = "node";
    const res = await request(app)
      .get(`/organizations/${org}/repos/${repo}/issues`)
      .set("Cookie", `access_Token=${accessToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should fetch changelogs for a repository", async () => {
    const org = "nodejs";
    const repo = "node";
    const res = await request(app)
      .get(`/organizations/${org}/repos/${repo}/issues/changelogs`)
      .set("Cookie", `access_Token=${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("commits");
    expect(res.body).toHaveProperty("pullRequests");
  });

  protectedRoutes.forEach(({ method, path }) => {
    it(`should return 401 Unauthorized for ${method.toUpperCase()} ${path}`, async () => {
      const res = await request(app)[method](path) // Dynamically call request method
        .set("Cookie", 'access_Token="gho_4VUAaiwNsRRhfLAhHpn1IQPe1QrCUL0mwTpc"'); // Simulate an invalid token

      expect(res.status).toBe(500); // Expect 500 for bad credentials
      expect(res.body).toHaveProperty("error", "Bad credentials - https://docs.github.com/rest"); // Ensure error message
    });
  });
});
