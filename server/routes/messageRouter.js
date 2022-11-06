const router = require("express").Router();
const {
  createMessage,
  updateMessage,
  deleteMessage,
  getAllMessages,
} = require("../controller/messageController");
const { protect } = require("../controller/authController");
router
  .route("/:inboxId")
  .post(protect, createMessage)
  .get(protect, getAllMessages);
router
  .route("/:msgId")
  .patch(protect, updateMessage)
  .delete(protect, deleteMessage);

module.exports = router;
