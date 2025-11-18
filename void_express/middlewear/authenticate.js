const { PrismaClient } = require('@prisma/client');
const bd = new PrismaClient();

exports.canUsersChat = async (user1Id, user2Id) => {
    try {
        // Проверяем являются ли пользователи друзьями
        const friendship = await bd.friends.findFirst({
            where: {
                OR: [
                    { user_id: user1Id, friend_id: user2Id, status: 'accepted' },
                    { user_id: user2Id, friend_id: user1Id, status: 'accepted' }
                ]
            }
        });

        return !!friendship;

    } catch (error) {
        console.error('Ошибка проверки дружбы:', error);
        return false;
    }
};

exports.getChatBetweenUsers = async (user1Id, user2Id) => {
    try {
        // Упорядочиваем ID для consistent поиска
        const sortedUsers = [user1Id, user2Id].sort((a, b) => a - b);
        
        const chat = await bd.chat.findFirst({
            where: {
                user1_id: sortedUsers[0],
                user2_id: sortedUsers[1]
            },
            include: {
                messages: {
                    orderBy: { created_at: 'asc' },
                    include: {
                        sender: {
                            select: { 
                                id: true,
                                name: true, 
                                last_name: true, 
                                avatar: true,
                                login: true
                            }
                        }
                    }
                },
                user1: {
                    select: {
                        id: true,
                        name: true,
                        last_name: true,
                        avatar: true,
                        login: true
                    }
                },
                user2: {
                    select: {
                        id: true,
                        name: true,
                        last_name: true,
                        avatar: true,
                        login: true
                    }
                }
            }
        });

        return chat;

    } catch (error) {
        console.error('Ошибка поиска чата:', error);
        throw error;
    }
};

exports.canAccessChat = async (req, res, next) => {
    try {
        const chatId = req.params.chatId || req.body.chatId;
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const chat = await bd.chat.findFirst({
            where: {
                id: parseInt(chatId),
                OR: [
                    { user1_id: parseInt(userId) },
                    { user2_id: parseInt(userId) }
                ]
            }
        });

        if (!chat) {
            return res.status(403).json({ error: 'Нет доступа к чату' });
        }

        req.chat = chat;
        next();
    } catch (error) {
        console.error('Ошибка проверки доступа к чату:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = exports;