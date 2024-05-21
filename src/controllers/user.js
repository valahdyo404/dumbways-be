const cloudinary = require("../utils/cloudinary")
const { user, transaction } = require("../../models")
const FILE_PATH = process.env.PATH_FILE || `http://localhost:5000/uploads/`

exports.getProfile = async (req, res) => {
  try {
    console.log(req.id.id)
    let data = await user.findOne({
      where: { id: req.id.id },
      include: {
        model: transaction,
        as: "userPayment",
        attributes: {
          exclude: ["updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    })
    if (data.profileImage) {
      data.profileImage = FILE_PATH + data.profileImage
    }
    if (data.userPayment.length > 0) {
      data.userPayment = data.userPayment.map((item) => {
        item.attache = FILE_PATH + item.attache
        return { ...item }
      })
    }
    res.status(200).send({
      data,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      msg: "Cannot get profile",
    })
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const id = req.id.id
    console.log("request update executed", req.file.path)
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "dumbsound-file",
        use_filename: true,
        unique_filename: false,
      })
      console.log("result woi", result)
      const toUpdate = await user.findOne({ where: { id } })
      if (toUpdate.profileImage) {
        cloudinary.uploader.destroy(
          toUpdate.profileImage,
          function (error, result) {
            console.log(result, error)
          }
        )
      }
      await user.update(
        { ...req.body, profileImage: result.public_id },
        {
          where: { id },
        }
      )
    } else {
      await user.update(
        { ...req.body },
        {
          where: { id },
        }
      )
    }

    res.status(200).send({
      status: "success",
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      status: "Failed",
      message: `Cannot update ${req.id.id} users`,
    })
  }
}
