const mongoose = require("mongoose");
const New = require("../models/new");
const { check, validationResult } = require("express-validator");

module.exports = {
  getAllNews: async (req, res) => {
    {
      try {
        let match = {};
        if (req.query.title) {
          match.$or = [{ title: new RegExp(req.query.title, "i") }]; //i  is a modifier (modifies the search to be case-insensitive).
        }

        if (req.query.date) {
          match.date = new Date(req.query.date);
        }

        // let sort = {};
        // if (req.query.sortBy) {
        //   const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
        //   if (req.query.sortBy === "date") {
        //     sort.date = sortOrder;
        //   } else {
        //     sort.title =
        //       sortOrder *
        //       new Intl.Collator(undefined, {
        //         sensitivity: "base",
        //         numeric: true,
        //       }).compare(req.query.sortBy);
        //   }
        // } else {
        //   sort.title = 1;
        // }

        let sort = {};

        if (req.query.sortBy) {
          const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
          if (req.query.sortBy === "date") {
            sort.date = sortOrder;
          } else {
            sort.title_lower = sortOrder; // use title_lower field for sorting
          }
        } else {
          sort.title_lower = 1; // use title_lower field for sorting
        }

        const response = await New.aggregate([
          { $match: match },
          {
            $addFields: {
              title_lower: { $toLower: "$title" },
            },
          },
          { $sort: sort },
          { $project: { title_lower: 0 } }, // remove title_lower field from response
        ]);

        res.json(response);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  },

  getById: async (req, res) => {
    try {
      const news = await New.findById(req.params.id);
      if (news == null) {
        return res.status(404).json({ message: "Not such new exists!" });
      }
      res.json(news);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  createSingleNewValidator: [
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
  createSingleNew: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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
  },

  updateANew: async (req, res) => {
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
  },

  deleteANew: async (req, res) => {
    try {
      const news = await New.findByIdAndDelete(req.params.id);
      if (!news) {
        return res.status(404).json({
          message: `Cannot find any product with ID ${req.params.id}`,
        });
      }
      res.status(200).json(news);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
