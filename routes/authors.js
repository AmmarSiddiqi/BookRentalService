const express = require("express");
const { Author } = require("../models/author");
const { validate } = require("../models/author");
const asyncMiddleware = require("../middleware/async");
const router = express.Router();

router.use(function (req, res, next) {
  console.log("Authors API" + req.url + " @ " + Date.now());
  next();
});

router.get(
  "/:id?",
  asyncMiddleware(async (req, res) => {
    // throw new Error('Something failed');
    if (req.params.id) {
      const author = await Author.findById({ _id: req.params.id })
        .sort("name")
        .select("name");
      if (!author) return res.status(400).send("Invalid ID");
      return res.status(200).send(author);
    }
    const author = await Author.find().sort("name").select("name");
    res.status(200).send(author);
  }));

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name } = req.body;
    const author = new Author({ name });
    await author.save();

    res.status(200).send(author);
  }
));

module.exports = router;
