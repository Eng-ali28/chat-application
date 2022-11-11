const router = require("express").Router();
const {
  createInbox,
  getAllInbox,
  getSpecificInbox,
  deleteInbox,
} = require("../controller/inboxController");
const { protect } = require("../controller/authController");
router.get("/", protect, getAllInbox);
router.route("/:friendPhone").post(protect, createInbox);
router
  .route("/:inboxId")
  .get(protect, getSpecificInbox)
  .delete(protect, deleteInbox);
module.exports = router;
