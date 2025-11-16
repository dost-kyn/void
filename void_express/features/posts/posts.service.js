const bd = require('../../utils/configuration.prisma')

exports.getAllPosts = async () => {
    const posts = await bd.posts.findMany()
    return posts
}