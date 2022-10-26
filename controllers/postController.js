const fs = require("fs");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const readPost = async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 });
  res.status(202).json(posts);
};
const createPost = async (req, res) => {
  const { posterId, message, video } = req.body;
  let newFileName;
  if (req.file !== undefined) {
    let fileType = req.file.mimetype.split("/")[1];
    newFileName = `${posterId}${Date.now()}.${fileType}`;
    fs.rename(
      `../frontend/public/images/uploads/posts/${req.file.filename}`,
      `../frontend/public/images/uploads/posts/${newFileName}`,
      function () {
        console.log("Callback");
      }
    );
  }
  try {
    const post = await new Post({
      posterId,
      message,
      picture:
        req.file !== undefined ? `./images/uploads/posts/${newFileName}` : "",
      video,
      likers: [],
      comments: [],
    });
    const savePost = await post.save();
    res.status(201).json(savePost);
  } catch (err) {
    res.status(400).send(err);
  }
};
const updatetePost = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      { _id: id },
      { $set: { message: req.body.message } },
      { new: true }
    );
    res.status(202).json(updatedPost);
  } catch (err) {
    res.status(401).json(err);
  }
};
const deletetePost = async (req, res) => {
  const { id } = req.params;
  try {
    await Post.findOneAndDelete({ _id: id });
    res.status(202).json({ message: "Successfully Deleted..." });
  } catch (err) {
    res.status(404).json(err);
  }
};
const likePost = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      { _id: id },
      { $addToSet: { likers: req.body.id } },
      { new: true }
    );
    const user = await User.findByIdAndUpdate(
      { _id: req.body.id },
      { $addToSet: { likes: id } },
      { new: true }
    ).select("-password");
    res.status(201).json({ updatedPost, user });
  } catch (err) {
    res.status(404).json(err);
  }
};
const unlikePost = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      { _id: id },
      { $pull: { likers: req.body.id } },
      { new: true }
    );
    const user = await User.findByIdAndUpdate(
      { _id: req.body.id },
      { $pull: { likes: id } },
      { new: true }
    ).select("-password");
    res.status(201).json({ updatedPost, user });
  } catch (err) {
    res.status(404).json(err);
  }
};
const commentPost = async (req, res) => {
  const { id } = req.params;
  const { commenterId, commenterPseudo, text } = req.body;
  try {
    const commentedPost = await Post.findByIdAndUpdate(
      { _id: id },
      {
        $push: {
          comments: {
            commenterId,
            commenterPseudo,
            text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true }
    );
    res.status(201).json(commentedPost);
  } catch (err) {
    res.status(401).json(err);
  }
};
const editCommentPost = async (req, res) => {
  const { id } = req.params;
  const { commentId, text } = req.body;
  try {
    const editedCommentPost = await Post.findOne({ _id: id });
    const theComment = editedCommentPost.comments.find((item) =>
      item._id.equals(commentId)
    );
    theComment.text = text;
    const saveComment = await editedCommentPost.save();
    res.status(200).json(saveComment);
  } catch (err) {
    res.status(404).json(err);
  }
};
const deleteCommentPost = async (req, res) => {
  const { id } = req.params;
  const { commentId } = req.body;
  try {
    await Post.findByIdAndUpdate(
      { _id: id },
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );
    res.status(202).json({ message: "Comment Deleted Successfully" });
  } catch (err) {
    res.status(404).json(err);
  }
};

module.exports = {
  readPost,
  createPost,
  updatetePost,
  deletetePost,
  likePost,
  unlikePost,
  commentPost,
  editCommentPost,
  deleteCommentPost,
};
