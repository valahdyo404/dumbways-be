const router = require("express").Router()
const { authJwt } = require("../middleware/authJwt")
const uploadMultiple = require("../middleware/uploadMultiple")
const { addMusic, getMusic } = require("../controllers/music")

router.post("/add/", uploadMultiple, authJwt, addMusic)
router.get("/", getMusic)

module.exports = router
