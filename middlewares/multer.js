const multer = require("multer");
const DIRPROFILE = "../frontend/public/images/uploads/profile";
const DIRPOST = "../frontend/public/images/uploads/posts";
const storageProfileImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIRPROFILE);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName);
  },
});
const storagePostImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIRPOST);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype !== "image/png" &&
    file.mimetype !== "image/jpg" &&
    file.mimetype !== "image/jpeg"
  )
    cb("Incompatible format");
  else cb(null, true);
};
const uploadProfileImage = multer({
  storage: storageProfileImage,
  fileFilter,
  limits: { fileSize: 500000 },
}).single("image");
const uploadPostImage = multer({
  storage: storagePostImage,
  fileFilter,
  limits: { fileSize: 500000 },
}).single("image");
module.exports = {
  uploadProfileImage,
  uploadPostImage,
};
