const request = require("supertest");
const { User } = require("../../../models/user");
const { Book } = require("../../../models/book");
let server;

describe("Auth Middleware", () => {
  beforeEach(() => {
    server = require("../../../index");
  });
  afterEach(async () => {
    server.close();
    await Book.remove({});
  });

  let token;
  const exec = () => {
    return request(server).post("/api/books/").set("auth-token", token).send({
      title: "title1",
      author: "61f3e9b398e5923f328db372",
      department: "Engineering",
      dailyRentalRate: 4,
    });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if invalid token is provided", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if invalid token is provided", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
