const PostsService = require("./posts.service");

exports.getAllPosts = async (req, res, next) => {
  const posts = await PostsService.getAllPosts
  if (posts.length <= 0) {
    const error = new Error("Посты не найдены");
    error.status = 404;
    return next(error);
  }
  res.status(200).json(posts);
};