const express = require("express");
const router = express.Router();
const New = require("../models/new");
const { check, validationResult } = require("express-validator");

// router.get("/", async (req, res) => {
//   try {
//     const news = await New.find();
//     res.json(news);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

router.get("/", async (req, res) => {
  try {
    let match = {};
    if (req.query.title) {
      match.$or = [{ title: new RegExp(req.query.title, "i") }]; //i  is a modifier (modifies the search to be case-insensitive).
    }

    if (req.query.date) {
      match.date = new Date(req.query.date);
    }

    let sort = { title: 1 };
    if (req.query.sortBy) {
      sort[req.query.sortBy] = req.query.sortOrder === "desc" ? -1 : 1;
    }
    const response = await New.aggregate([{ $match: match }, { $sort: sort }]);
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const news = await New.findById(req.params.id);
    if (news == null) {
      return res.status(404).json({ message: "Not such new exists!" });
    }
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post(
  "/",
  [
    check("title")
      .notEmpty()
      .withMessage("Title cannot be empty!")
      .isLength({ min: 5 })
      .withMessage("Title must be at least 5 characters long!"),
    check("description")
      .notEmpty()
      .withMessage("Description cannot be empty!")
      .isLength({ min: 15 })
      .withMessage("Description must be at least 15 characters long!"),
    check("text")
      .notEmpty()
      .withMessage("Text cannot be empty!")
      .isLength({ min: 20 })
      .withMessage("Text must be at least 20 characters long!"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }

    const news = new New({
      title: req.body.title,
      date: req.body.date,
      description: req.body.description,
      text: req.body.text,
    });

    try {
      const n1 = await news.save();
      res.status(201).json(n1);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// router.post("/", async (req, res) => {
//     try {
//       const n1 = await New.create(req.body);
//       res.status(201).json(n1);
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   });

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const singleNew = await New.findByIdAndUpdate(id, req.body);

    if (!singleNew) {
      return res
        .status(404)
        .json({ message: `Cannot find any product with ID ${id}` });
    }
    const updatedNew = await New.findById(id);
    res.status(200).json(updatedNew);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const news = await New.findById(req.params.id);
    news.title = req.body.title;
    const n1 = await news.save();
    res.json(n1);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const news = await New.findByIdAndRemove(req.params.id);
    if (!news) {
      return res
        .status(404)
        .json({ message: `Cannot find any product with ID ${req.params.id}` });
    }
    res.status(200).json(news);

    // const n1 = await news.deleteOne();
    // res.json(n1);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getSingleNew(req, res, next) {
  let singleNew;

  try {
    singleNew = await New.findById(req.params.id);
    if (singleNew == null) {
      return res.status(404).json({ message: "Cannot find subscriber" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.singleNew = singleNew;
  next();
}

module.exports = router;
