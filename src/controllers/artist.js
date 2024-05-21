const { artist, music } = require("../../models")
const Joi = require("joi")

exports.addArtist = async (req, res) => {
  //Validating

  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      old: Joi.string().required(),
      type: Joi.string().required(),
      startCarerr: Joi.string().required(),
    })
    const { error } = schema.validate(req.body)
    if (error)
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      })
    if (req.id.listAs) {
      const newArtist = await artist.create({
        ...req.body,
      })

      res.status(200).send({
        status: "success",
        data: newArtist,
      })
    } else {
      res.status(401).send({
        status: "Only Admin!",
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ status: "failed", msg: "Add Artist Error" })
  }
}

exports.getArtists = async (req, res) => {
  try {
    if (req.id.listAs === 1) {
      const data = await artist.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      })
      res.status(200).send({
        msg: "succes",
        artis: data,
      })
    } else {
      res.status(401).send({
        status: "Only Admin!",
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      msg: "Cannot get all artists",
    })
  }
}
