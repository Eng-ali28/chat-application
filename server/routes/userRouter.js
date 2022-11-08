const {
  createUser,
  getAllUser,
  updateUser,
  getSpecificUser,
  deleteUser,
  updataStatusOnline,
  updataStatusOffline,
} = require("../controller/userController");
const { protect } = require("../controller/authController");
const router = require("express").Router();
const { createValidator } = require("../utils/validation/userValidator");
router.route("/").post(createValidator, createUser).get(getAllUser);
router
  .route("/:userId")
  .get(getSpecificUser)
  .put(updateUser)
  .delete(deleteUser);
router.patch("/:userId/online", protect, updataStatusOnline);
router.patch("/:userId/offline", updataStatusOffline);

module.exports = router;
