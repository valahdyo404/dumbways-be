const { user } = require("../../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Joi = require("joi")
require("dotenv").config()
const FILE_PATH = process.env.PATH_FILE || `http://localhost:5000/uploads/`

exports.registerUser = async (req, res) => {
  //Validating
  const schema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
    gender: Joi.string().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
  })
  const { error } = schema.validate(req.body)
  if (error) {
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    })
  }
  try {
    const { fullName, email, password, gender, phone, address } = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const data = await user.create({
      fullName,
      email,
      password: hashedPassword,
      listAs: 0,
      gender,
      phone,
      address,
      subscribe: 0,
    })
    const accessToken = jwt.sign(
      { id: data.id, listAs: data.listAs },
      process.env.SECRET_TOKEN,
      {
        expiresIn: 86400, // 24 hours
      }
    )
    res.status(200).send({
      msg: "success",
      data: {
        user: data,
      },
      accessToken,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      status: "Failed",
      message: "Register error",
    })
  }
}

exports.loginUser = async (req, res) => {
  //Validating
  const { email, password } = req.body
  try {
    let data = await user.findOne({
      where: { email },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    })
    console.log("data ", data)
    console.log(
      "password ditulis ",
      password,
      "password database ",
      data.password
    )
    //Check password is valid
    const isValid = await bcrypt.compare(password, data.password)
    if (!isValid) {
      return res.status(400).send({
        status: "Failed",
        message: "User or password is doesn't match",
      })
    }
    console.log(data.listAs)
    //Generate JWT Token when login success
    const accessToken = jwt.sign(
      { id: data.id, listAs: data.listAs },
      process.env.SECRET_TOKEN,
      {
        expiresIn: 86400, // 24 hours
      }
    )
    if (data.profileImage) {
      data.profileImage = FILE_PATH + data.profileImage
    }
    res.status(200).send({
      msg: "success",
      data: {
        user: data,
      },
      accessToken,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      status: "Failed",
      message: "User or password is doesn't match",
    })
  }
}

exports.checkAuth = async (req, res) => {
  try {
    let data = await user.findOne({
      where: { id: req.id.id },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    })
    if (data.profileImage) {
      data.profileImage = FILE_PATH + data.profileImage
    }
    res.status(200).send({
      status: "success",
      data: {
        user: data,
      },
    })
  } catch (error) {
    console.log(error)
    res.status(404).send({
      status: "Failed",
      message: "Unauthorized",
    })
  }
}
