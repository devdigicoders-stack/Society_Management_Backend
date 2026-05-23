const express = require("express");
const upload = require("../middlewares/uploadMiddleware");
const { uploadSingleFile } = require("../controllers/uploadController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/single",
  protect,
  upload.single("file"),
  uploadSingleFile
);

module.exports = router;