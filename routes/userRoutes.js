const express = require("express");
const {
  register,
  login,
  getMe,
  getUsers,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", auth, getUsers);
router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);

module.exports = router;
