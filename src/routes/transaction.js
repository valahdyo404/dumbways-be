const router = require("express").Router()
const { authJwt } = require("../middleware/authJwt")

const { uploadFile } = require("../middleware/uploadFile")
const {
  addTransaction,
  getTransaction,
  approveTransaction,
  cancelTransaction,
  updateStatus,
  deleteTransaction,
  paymentGateway,
  notification,
} = require("../controllers/transaction")

router.post("/create", authJwt, uploadFile("attache"), addTransaction)
router.get("/create-gateway", authJwt, paymentGateway)
router.patch("/approve/:idTransaction", authJwt, approveTransaction)
router.patch("/cancel/:idTransaction", authJwt, cancelTransaction)
router.patch("/update/:idTransaction", authJwt, updateStatus)
router.delete("/delete/:idTransaction", authJwt, deleteTransaction)
router.post("/notification", notification)
router.get("/", authJwt, getTransaction)

module.exports = router
