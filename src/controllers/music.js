const { artist, music } = require("../../models")
const Joi = require("joi")
const cloudinary = require("../utils/cloudinary")
const FILE_PATH = process.env.PATH_FILE || "http://localhost:5000/uploads/"
const AUDIO_PATH = process.env.AUDIO_PATH

exports.addMusic = async (req, res) => {
  try {
    // Validating
    const schema = Joi.object({
      title: Joi.string().required(),
      year: Joi.string().required(),
      artisId: Joi.string().required(),
    })
    const { error } = schema.validate(req.body)
    if (error)
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      })
    if (req.id.listAs) {
      const result_thumbnail = await cloudinary.uploader.upload(
        req.files.thumbnail[0].path,
        {
          folder: "dumbsound-file",
          use_filename: true,
          unique_filename: false,
        }
      )
      const result_attache = await cloudinary.uploader.upload(
        req.files.attache[0].path,
        {
          folder: "dumbsound-file",
          resource_type: "raw",
          use_filename: true,
          unique_filename: false,
        }
      )

      const newMusic = await music.create({
        ...req.body,
        thumbnail: result_thumbnail.public_id,
        attache: result_attache.public_id,
      })
      res.status(200).send({
        status: "success",
        data: newMusic,
      })
    } else {
      res.status(401).send({
        status: "Only Admin!",
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ status: "failed", msg: "Add music error" })
  }
}

exports.getMusic = async (req, res) => {
  try {
    let data = await music.findAll({
      include: {
        model: artist,
        as: "artist",
        attributes: ["name", "id"],
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "artisId"],
      },
    })

    data = JSON.parse(JSON.stringify(data))
    data = data.map((item) => {
      item.thumbnail = FILE_PATH + item.thumbnail
      item.attache = AUDIO_PATH + item.attache
      return { ...item }
    })
    res.status(200).send({
      msg: "success",
      data,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      msg: "Failed to get music lists",
    })
  }
}
