const bd = require('../../utils/configuration.prisma')


//===============  вызвать всех
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

    if (category) {
        return "Категория с таким названием уже существует"
    }
    return null
}

exports.VerifyCreateCategory = async (name) => {
    if (!name) {
        return "Введите название категории"
    }
    return null
}


//===============  создание категории
exports.createCategory = async (name) => {
    const category = await bd.category.create({
        data: { name }
    });
    return category;
}

// Проверяем привязанные посты
// if (category.posts.length > 0) {
//     throw new Error('Нельзя удалить категорию с привязанными постами');
// }


//===============  изменение категории
exports.updateCategory = async (id, name) => {
    const category = await bd.category.update({
        where: { id: parseInt(id) },
        data: { name }
    });
    return category;
}




//===============  удаление категории
exports.findCategoryId = async (id) => {
    if (id) {
        const categoryId = parseInt(id);
        const category = await bd.category.findUnique({
            where: { id: categoryId }
        })
        return category
    }
    return null
}

exports.deleteCategory = async (id) => {
    if (id) {
        const categoryId = parseInt(id);
        const category = await bd.category.delete({
            where: { id: categoryId }
        })
        return category
    }
    return null
}
