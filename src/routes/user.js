const router = require("express").Router()
const { authJwt } = require("../middleware/authJwt")
const { uploadFile } = require("../middleware/uploadFile")
const { getProfile, updateProfile } = require("../controllers/user")

router.get("/profile", authJwt, getProfile)
router.patch(
  "/edit-profile",
  authJwt,
  uploadFile("profileImage"),
  updateProfile
)

module.exports = router
