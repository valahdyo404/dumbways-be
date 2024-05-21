const router = require("express").Router()
const { authJwt } = require("../middleware/authJwt")
const { checkDuplicateEmail } = require("../middleware/verifyRegister")
const { registerUser, loginUser, checkAuth } = require("../controllers/auth")

router.post("/register", checkDuplicateEmail, registerUser)
router.post("/login", loginUser)
router.get("/check-auth", authJwt, checkAuth)

module.exports = router
