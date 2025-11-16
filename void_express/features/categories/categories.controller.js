const CategoryService = require("./categories.service");

exports.getAllCategories = async (req, res, next) => {
  const categories = await CategoryService.getAllCategories
  if (categories.length <= 0) {
    const error = new Error("Категории не найдены");
    error.status = 404;
    return next(error);
  }
  res.status(200).json(categories);
};

exports.createCategory = async (req, res, next) => {
  const { name } = req.body;
  const validationError = await CategoryService.VerifyCreateCategory(name);
  const uniquenessError = await CategoryService.VerifyNameCategory(name);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }
  if (uniquenessError) {
    return res.status(400).json({ error: uniquenessError });
  }

  const newCategory = await CategoryService.createCategory({ name });
  // if (newCategory.length <= 0) {
  //   const error = new Error("Категории не найдены");
  //   error.status = 404;
  //   return next(error);
  // }
  
  res.status(200).json({
    message: 'Категория успешно создана',
    category: newCategory
  });
}