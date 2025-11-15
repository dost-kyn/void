const bd = require('../../utils/configuration.prisma')

exports.getAllCategories = async () => {
    const categories = await bd.category.findMany()
    return categories
}

exports.postCountCategory = async (categoryId) => {
    const CountСategories = await bd.post.count({  
        where: { id: categoryId }
    })
    return CountСategories
}

exports.VerifyNameCategory = async (name) => {
    const category = await bd.category.findFirst({
        where: { name: name }
    });

    if(category){
        return "Категория с таким названием уже существует"
    } 
    return null
}

exports.VerifyCreateCategory = async (name) => {
    if(!name){
        return "Введите название категории"
    }
    return null
}

exports.createCategory = async (userData) => {
  const category = await bd.category.create({
    data: {
      name: userData.name
    },
  });
  return category;
};

// Проверяем привязанные посты
        // if (category.posts.length > 0) {
        //     throw new Error('Нельзя удалить категорию с привязанными постами');
        // }