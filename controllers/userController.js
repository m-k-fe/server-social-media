const User = require("../models/userModel");
const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(200).json(users);
};
const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id }).select("-password");
    if (user) return res.status(200).json(user);
    else return res.status(404).json({ message: `Id Uknown: ${id}` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).select("-password");
    res.status(201).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findOneAndDelete({ _id: id });
    res.status(200).json({ message: "Successfully Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const follow = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser1 = await User.findByIdAndUpdate(
      { _id: id },
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true }
    ).select("-password");
    const updatedUser2 = await User.findByIdAndUpdate(
      { _id: req.body.idToFollow },
      { $addToSet: { followers: id } },
      { new: true, upsert: true }
    ).select("-password");
    res.status(201).json({ updatedUser1, updatedUser2 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const unFollow = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser1 = await User.findByIdAndUpdate(
      { _id: id },
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true }
    ).select("-password");
    const updatedUser2 = await User.findByIdAndUpdate(
      { _id: req.body.idToUnfollow },
      { $pull: { followers: id } },
      { new: true, upsert: true }
    ).select("-password");
    res.status(201).json({ updatedUser1, updatedUser2 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  follow,
  unFollow,
};
