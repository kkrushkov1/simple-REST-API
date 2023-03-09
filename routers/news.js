const express = require("express");
const router = express.Router();
const NewsController = require("../controllers/News");

router.get("/", NewsController.getAllNews);

router.get("/:id", NewsController.getById);

router.post(
  "/",
  NewsController.createSingleNewValidator,
  NewsController.createSingleNew
);

router.put("/:id", NewsController.updateANew);

router.delete("/:id", NewsController.deleteANew);

module.exports = router;
