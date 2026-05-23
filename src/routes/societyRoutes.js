const express = require("express");
const router = express.Router();
const {
  createSociety,
  getAllSocieties,
  getSocietyById,
  updateSociety,
  deleteSociety,
} = require("../controllers/societyController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Only SYSTEM_ADMIN can manage societies
router.use(protect);
router.use(authorize("SYSTEM_ADMIN"));

router.route("/").post(createSociety).get(getAllSocieties);
router
  .route("/:id")
  .get(getSocietyById)
  .put(updateSociety)
  .delete(deleteSociety);

module.exports = router;
