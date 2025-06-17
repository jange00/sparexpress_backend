// const multer = require("multer")
// const {v4: uuidv4} = require("uuid")

// const storage = multer.diskStorage(
//     {
//         destination: (req, file, cb) => cb(null, "uploads/"),
//         filename: (req, file, cb) => {
//             const ext = file.originalname.split(".").pop()
//             cb(null, `${file.fieldname}-${uuidv4()}.${ext}`)
//         }
//     }
// )

// const fileFilter = (req, file, cb) => {
//     if(file.mimetype.startsWith("image")) cb(null, true)
//         else cb(new Error("Only image allowed"), false)
// }

// const upload = multer(
//     {
//         storage,
//         limits: {fileSize: 5 * 1024 * 1024}, // 5mb
//         fileFilter // optional 
//     }
// )

// module.exports = {
//     single: (fieldname) => upload.single(fieldname),
//     array: (fieldname) => upload.array(fieldname, maxCount),
//     fields: (fieldsArray) => upload.fields(fieldsArray)
// }

const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${file.fieldname}-${uuidv4()}.${ext}`);
  }
});

// Filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new Error("Only images are allowed"), false);
};

// Multer instance
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter
});

// Export methods
module.exports = {
  single: (fieldname) => upload.single(fieldname),
  array: (fieldname, maxCount = 10) => upload.array(fieldname, maxCount),
  fields: (fieldsArray) => upload.fields(fieldsArray)
};
