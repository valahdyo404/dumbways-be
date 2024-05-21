const express = require("express")
const router = express.Router()
const authRoutes = require("./auth")
const transactionRoutes = require("./transaction")
const artistRoutes = require("./artist")
const musicRoutes = require("./music")
const userRoutes = require("./user")

router.use("/auth", authRoutes)
router.use("/transaction", transactionRoutes)
router.use("/artist", artistRoutes)
router.use("/music", musicRoutes)
router.use("/user", userRoutes)

module.exports = router
