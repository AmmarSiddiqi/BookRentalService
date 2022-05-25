const request = require("supertest");
const { Book } = require("../../../models/book");
const { User } = require("../../../models/user");
const { Author } = require("../../../models/author");

let server;

describe("Books API", () => {
  beforeEach(() => {
    server = require("../../../index");
  });
  afterEach(async () => {
    server.close();
    await Author.remove({});
    await Book.remove({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Book.collection.insertMany([
        { title: "title1" },
        { title: "title2" },
      ]);

      const res = await request(server).get("/api/books");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((b) => b.title === "title1")).toBeTruthy();
      expect(res.body.some((b) => b.title === "title2")).toBeTruthy();
    });

    it("should return book if valid id is passed", async () => {
      const book = new Book({
        title: "title1",
        author: "61f3e9b398e5923f328db372",
        department: "Computer Science",
        dailyRentalRate: 4,
      });
      await book.save();
      const res = await request(server).get("/api/books/" + book._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", book.title);
    });

    it("should return 400 if invalid ID is provided", async () => {
      const res = await request(server).get("/api/books/1");
      expect(res.status).toBe(400);
    });

    it("should return 404 if book not found", async () => {
      const res = await request(server).get(
        "/api/books/" + "61f3e9b398e5923f328db372"
      );
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let title, author, department, dailyRentalRate, token;
    const exec = async () => {
      return await request(server)
        .post("/api/books/")
        .set("auth-token", token)
        .send({
          title,
          author,
          department,
          dailyRentalRate,
        });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      (title = "title"),
        (author = "61f3e9b398e5923f328db372"),
        (department = "Computer Science"),
        (dailyRentalRate = 4);
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if book title is less than 3 characters", async () => {
      // const token = new User().generateAuthToken();
      title = "ab";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if book title is more than 256 characters", async () => {
      title = new Array(259).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the book if it is valid", async () => {
      const book = await Book.find({ title: "title10" });
      expect(book).not.toBeNull();
    });

    it("should return the book if it is valid", async () => {
      // const author = new Author({ name: 'Muhammad Ammar Siddiqi'});
      // await author.save();
      // const authorId = await Author.findOne({_id : author._id}).select('_id');
      // console.log(authorId.toString());
      // expect(res.body).toHaveProperty("_id");

      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title");
    });
  });
});
