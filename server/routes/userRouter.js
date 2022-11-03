const {
  createUser,
  getAllUser,
  updateUser,
  getSpecificUser,
  deleteUser,
} = require("../controller/userController");

const router = require("express").Router();
const { createValidator } = require("../utils/validation/userValidator");
router.route("/").post(createValidator, createUser).get(getAllUser);
router
  .route("/:userId")
  .get(getSpecificUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
