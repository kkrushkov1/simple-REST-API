const express = require("express");
const router = express.Router();
const NewsController = require("../controllers/news");

// router.get("/", async (req, res) => {
//   try {
//     const news = await New.find();
//     res.json(news);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

router.get("/", NewsController.getAllNews);

router.get("/:id", NewsController.getById);

router.post(
  "/",
  NewsController.createSingleNewValidator,
  NewsController.createSingleNew
);

// router.post("/", async (req, res) => {
//     try {
//       const n1 = await New.create(req.body);
//       res.status(201).json(n1);
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   });

router.put("/:id", NewsController.updateANew);

router.delete("/:id", NewsController.deleteANew);

// async function getSingleNew(req, res, next) {
//   let singleNew;

//   try {
//     singleNew = await New.findById(req.params.id);
//     if (singleNew == null) {
//       return res.status(404).json({ message: "Cannot find subscriber" });
//     }
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
//   res.singleNew = singleNew;
//   next();
// }

module.exports = router;
