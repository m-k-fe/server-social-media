const fs = require("fs");
const User = require("../models/userModel");
const uploadProfile = async (req, res) => {
  const { pseudo, userId } = req.body;
  let fileType = req.file.mimetype.split("/")[1];
  let newFileName = `${pseudo}.${fileType}`;
  fs.rename(
    `../frontend/public/images/uploads/profile/${req.file.filename}`,
    `../frontend/public/images/uploads/profile/${newFileName}`,
    function () {
      console.log("Callback");
    }
  );
  try {
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { picture: `./images/uploads/profile/${newFileName}` } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).select("-password");
    res.status(200).json(user);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
};
module.exports = {
  uploadProfile,
};
