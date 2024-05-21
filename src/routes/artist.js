const router = require("express").Router()
const { authJwt } = require("../middleware/authJwt")
const { addArtist, getArtists } = require("../controllers/artist")

router.post("/add", authJwt, addArtist)
router.get("/", authJwt, getArtists)

module.exports = router
