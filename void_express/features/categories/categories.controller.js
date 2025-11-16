const CategoryService = require("./categories.service");

//===============  вызвать всех
exports.getAllCategories = async (req, res, next) => {
  const categories = await CategoryService.getAllCategories()
  
  res.status(200).json(categories);
};


//===============  создание категории
exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const newCategory = await CategoryService.createCategory(name.trim());
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error in createCategory:', error);
    
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Category already exists' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};


//===============  изменение категории
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    
    const updatedCategory = await CategoryService.updateCategory(id, name.trim());
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error in updateCategory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



//===============  удаление категории
exports.deleteCategory = async(req, res, next) => {
  const { id } = req.params
  
  const category = await CategoryService.findCategoryId(id)

  if(!category){
    return res.status(404).json({message: 'Категория не найдена'})
  }

  await CategoryService.deleteCategory(id)

  return res.status(200).json({message: 'Категория не найдена'})

}