const { user, transaction } = require("../../models")
const midtransClient = require("midtrans-client")
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY
const cloudinary = require("../utils/cloudinary")
const req = require("express/lib/request")
const IMAGE_PATH = process.env.PATH_FILE || `http://localhost:5000/uploads/`

// Add Transaction
exports.addTransaction = async (req, res) => {
  try {
    console.log(req.file.path)
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "dumbsound-file",
      use_filename: true,
      unique_filename: false,
    })
    const newPayment = await transaction.create({
      id: parseInt(Math.random().toString().slice(3, 8)),
      startDate: null,
      dueDate: null,
      attache: result.public_id,
      userId: req.id.id,
      status: "Pending",
    })

    res.status(200).send({
      status: "success",
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ status: "failed", msg: "Add transaction error" })
  }
}

exports.paymentGateway = async (req, res) => {
  try {
    let buyerData = await user.findOne({
      where: { id: req.id.id },

      attributes: ["id", "fullName", "email", "subscribe"],
    })

    let snap = new midtransClient.Snap({
      // Set to true if you want Production Environment (accept real transaction).
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    })

    let parameter = {
      transaction_details: {
        order_id:
          req.id.id + "id" + parseInt(Math.random().toString().slice(3, 8)),
        gross_amount: 50000,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        full_name: buyerData?.fullName,
        email: buyerData?.email,
        phone: buyerData?.phone,
      },
    }
    const payment = await snap.createTransaction(parameter)
    console.log(payment, "Payment executed")
    res.status(200).send({
      payment,
    })
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}

const core = new midtransClient.CoreApi()

core.apiConfig.set({
  isProduction: false,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
})

exports.notification = async (req, res) => {
  try {
    const statusResponse = await core.transaction.notification(req.body)
    const orderId = statusResponse.order_id
    const transactionStatus = statusResponse.transaction_status
    const fraudStatus = statusResponse.fraud_status

    console.log(statusResponse)

    if (transactionStatus == "capture") {
      if (fraudStatus == "challenge") {
        // TODO set transaction status on your database to 'challenge'
        // and response with 200 OK
        updateTransaction("Pending", orderId)
        res.status(200)
      } else if (fraudStatus == "accept") {
        // TODO set transaction status on your database to 'success'
        // and response with 200 OK
        updateTransaction("Approve", orderId)
        res.status(200)
      }
    } else if (transactionStatus == "settlement") {
      // TODO set transaction status on your database to 'success'
      // and response with 200 OK
      updateTransaction("Approve", orderId)
      res.status(200)
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "deny" ||
      transactionStatus == "expire"
    ) {
      // TODO set transaction status on your database to 'failure'
      // and response with 200 OK
      updateTransaction("Cancel", orderId)
      res.status(200)
    } else if (transactionStatus == "pending") {
      // TODO set transaction status on your database to 'pending' / waiting payment
      // and response with 200 OK
      updateTransaction("Pending", orderId)
      res.status(200)
    }
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}

const updateTransaction = async (status, transactionId) => {
  let str = transactionId.split("id")
  data = await transaction.findOne({
    where: { id: parseInt(str[1]) },
  })
  console.log(data, status, transactionId)
  if (!data) {
    await transaction.create({
      id: parseInt(str[1]),
      startDate: null,
      dueDate: null,
      userId: parseInt(str[0]),
      status,
    })
    if (status === "Approve") {
      const today = new Date()
      const dueDate = new Date(new Date().setDate(today.getDate() + 30))
      await transaction.update(
        { dueDate, startDate: today },
        {
          where: { id: parseInt(str[1]) },
        }
      )
      await user.update(
        { subscribe: 1 },
        {
          where: { id: parseInt(str[0]) },
        }
      )
    }
  }
}

// Get all transaction list
exports.getTransaction = async (req, res) => {
  try {
    console.log(req.id)
    if (req.id.listAs === 1) {
      let data = await transaction.findAll({
        include: {
          model: user,
          as: "user",
          attributes: ["fullName", "subscribe"],
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "userId"],
        },
      })

      data = JSON.parse(JSON.stringify(data))
      data.map((item, index) => {
        item.attache = IMAGE_PATH + item.attache
        return { ...item }
      })

      res.status(200).send({
        data,
      })
    } else {
      res.status(401).send({
        status: "Only Admin!",
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      msg: "Failed to get all transaction",
    })
  }
}

// Approve incoming transaction
exports.approveTransaction = async (req, res) => {
  try {
    if (req.id.listAs === 1) {
      const today = new Date()
      const dueDate = new Date(new Date().setDate(today.getDate() + 30))
      await transaction.update(
        { status: "Approve", dueDate, startDate: today },
        {
          where: { id: req.params.idTransaction },
        }
      )
      let data = await transaction.findOne({
        where: { id: req.params.idTransaction },
      })
      await user.update(
        { subscribe: 1 },
        {
          where: { id: data.userId },
        }
      )
      res.status(200).send({
        status: "success",
      })
    } else {
      res.status(401).send({
        status: "Only Admin!",
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ status: "failed", msg: "Cannot approve Status" })
  }
}

// Cancel incoming transaction
exports.cancelTransaction = async (req, res) => {
  try {
    if (req.id.listAs === 1) {
      await transaction.update(
        { status: "Cancel", startDate: null, dueDate: null },
        {
          where: { id: req.params.idTransaction },
        }
      )
      let data = await transaction.findOne({
        where: { id: req.params.idTransaction },
      })
      await user.update(
        { subscribe: 0 },
        {
          where: { id: data.userId },
        }
      )
      res.status(200).send({
        status: "success",
      })
    } else {
      res.status(401).send({
        status: "Only Admin!",
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ status: "failed", msg: "Cannot cancel Status" })
  }
}

// Delete incoming transaction
exports.deleteTransaction = async (req, res) => {
  try {
    let data = await transaction.findOne({
      where: { id: req.params.idTransaction },
    })
    if (req.id.listAs === 1) {
      if (data.attache) {
        cloudinary.uploader.destroy(data.attache, function (error, result) {
          console.log(result, error)
        })
      }
      await transaction.destroy({
        where: { id: req.params.idTransaction },
      })
      await user.update(
        { subscribe: 0 },
        {
          where: { id: data.userId },
        }
      )
      res.status(200).send({
        status: "success",
      })
    } else {
      res.status(401).send({
        status: "Only Admin!",
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ status: "failed", msg: "Cannot delete transaction" })
  }
}

// Update status user
exports.updateStatus = async (req, res) => {
  try {
    if (req.id.listAs === 1) {
      const transactionData = await transaction.findOne({
        where: { id: req.params.idTransaction },
      })
      await transaction.update(
        { startDate: null, dueDate: null },
        {
          where: { id: transactionData.id },
        }
      )
      console.log("update ", user, transactionData.userId)
      await user.update(
        { subscribe: 0 },
        {
          where: { id: transactionData.userId },
        }
      )
      res.status(200).send({
        status: "success",
      })
    } else {
      res.status(401).send({
        status: "Only Admin!",
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      status: "Failed",
      message: "Cannot update status",
    })
  }
}
