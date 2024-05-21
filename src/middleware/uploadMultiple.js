const multer = require("multer")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(req.file)
    cb(null, "uploads")
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "-" +
        file.originalname.replace(/\s/g, "-")
    )
  },
})

const upload = multer({ storage: storage })

const uploadMultiple = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "attache", maxCount: 1 },
])

module.exports = uploadMultiple
