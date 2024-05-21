const { chat, user } = require("../../models")
const FILE_PATH = "http://localhost:5000/uploads/"
const jwt = require("jsonwebtoken")
const { Op } = require("sequelize")
const connectedUser = {}

const socketIo = (io) => {
  io.on("connection", (socket) => {
    console.log("client connect:", socket.id)
    const userId = socket.handshake.query.id

    // save to connectedUser
    connectedUser[userId] = socket.id

    socket.on("load admin contact", async () => {
      try {
        const adminContact = await user.findOne({
          where: {
            listAs: 1,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        })

        socket.emit("admin contact", adminContact)
      } catch (err) {
        console.log(err)
      }
    })

    socket.on("load customer contacts", async () => {
      try {
        let customerContacts = await user.findAll({
          include: [
            {
              model: chat,
              as: "recipientMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt", "idRecipient", "idSender"],
              },
            },
            {
              model: chat,
              as: "senderMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt", "idRecipient", "idSender"],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        })

        customerContacts = JSON.parse(JSON.stringify(customerContacts))
        customerContacts = customerContacts.map((item) => ({
          ...item,
          profile: {
            ...item.profile,
            image: item.profile?.image
              ? process.env.FILE_PATH + item.profile?.image
              : null,
          },
        }))

        socket.emit("customer contacts", customerContacts)
      } catch (err) {
        console.log(err)
      }
    })

    socket.on("load messages", async (payload) => {
      try {
        const token = socket.handshake.auth.token
        console.log(token)
        const tokenKey = process.env.SECRET_TOKEN
        const verified = jwt.verify(token, tokenKey)

        const idRecipient = payload // catch recipient id sent from client
        const idSender = verified.id //id user

        const data = await chat.findAll({
          where: {
            idSender: {
              [Op.or]: [idRecipient, idSender],
            },
            idRecipient: {
              [Op.or]: [idRecipient, idSender],
            },
          },
          include: [
            {
              model: user,
              as: "recipient",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
            },
            {
              model: user,
              as: "sender",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
            },
          ],
          order: [["createdAt", "ASC"]],
          attributes: {
            exclude: ["createdAt", "updatedAt", "idRecipient", "idSender"],
          },
        })

        socket.emit("messages", data)
      } catch (error) {
        console.log(error)
      }
    })

    socket.on("send message", async (payload) => {
      try {
        const token = socket.handshake.auth.token

        const tokenKey = process.env.SECRET_TOKEN
        const verified = jwt.verify(token, tokenKey)

        const idSender = verified.id //id user
        const { message, idRecipient } = payload // catch recipient id and message sent from client

        await chat.create({
          message,
          idRecipient,
          idSender,
        })

        // emit to just sender and recipient default rooms by their socket id
        io.to(socket.id)
          .to(connectedUser[idRecipient])
          .emit("new message", idRecipient)
      } catch (error) {
        console.log(error)
      }
    })

    socket.on("disconnect", () => {
      console.log("client disconnected", socket.id)
      delete connectedUser[userId]
    })
  })
}

module.exports = socketIo
