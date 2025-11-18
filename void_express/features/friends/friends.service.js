const bd = require('../../utils/configuration.prisma');

// Получить список друзей пользователя
exports.getUserFriends = async (userId) => {
    const friends = await bd.friends.findMany({
        where: {
            OR: [
                { user1_id: parseInt(userId), status: 'Accepted' },
                { user2_id: parseInt(userId), status: 'Accepted' }
            ]
        },
        include: {
            user1: {
                select: {
                    id: true,
                    name: true,
                    last_name: true,
                    login: true,
                    avatar: true,
                    created_at: true
                }
            },
            user2: {
                select: {
                    id: true,
                    name: true,
                    last_name: true,
                    login: true,
                    avatar: true,
                    created_at: true
                }
            }
        }
    });

    return friends.map(friendship => {
        const friend = friendship.user1_id === parseInt(userId) ? friendship.user2 : friendship.user1;
        return {
            id: friend.id,
            name: friend.name,
            last_name: friend.last_name,
            login: friend.login,
            avatar: friend.avatar,
            created_at: friend.created_at,
            friendship_id: friendship.id
        };
    });
};

// Получить заявки в друзья (входящие)
exports.getFriendRequests = async (userId) => {
    const requests = await bd.friends.findMany({
        where: {
            user2_id: parseInt(userId),
            status: 'Expectation'
        },
        include: {
            user1: {
                select: {
                    id: true,
                    name: true,
                    last_name: true,
                    login: true,
                    avatar: true,
                    created_at: true
                }
            }
        },
        orderBy: {
            id: 'desc'
        }
    });

    return requests.map(request => ({
        id: request.user1.id,
        name: request.user1.name,
        last_name: request.user1.last_name,
        login: request.user1.login,
        avatar: request.user1.avatar,
        created_at: request.user1.created_at,
        friendship_id: request.id,
        full_name: `${request.user1.name} ${request.user1.last_name}`
    }));
};

// Получить отправленные заявки (исходящие)
exports.getSentFriendRequests = async (userId) => {
    const sentRequests = await bd.friends.findMany({
        where: {
            user1_id: parseInt(userId),
            status: 'Expectation'
        },
        include: {
            user2: {
                select: {
                    id: true,
                    name: true,
                    last_name: true,
                    login: true,
                    avatar: true,
                    created_at: true
                }
            }
        },
        orderBy: {
            id: 'desc'
        }
    });

    return sentRequests.map(request => ({
        id: request.user2.id,
        name: request.user2.name,
        last_name: request.user2.last_name,
        login: request.user2.login,
        avatar: request.user2.avatar,
        created_at: request.user2.created_at,
        friendship_id: request.id,
        full_name: `${request.user2.name} ${request.user2.last_name}`
    }));
};




// Функция создания чата между двумя пользователями
const createChatBetweenUsers = async (user1Id, user2Id) => {
    try {
        console.log('🔄 Создание чата между:', user1Id, user2Id);
        
        // Упорядочиваем ID чтобы избежать дубликатов
        const sortedUsers = [parseInt(user1Id), parseInt(user2Id)].sort((a, b) => a - b);

        // Проверяем не существует ли уже чат
        const existingChat = await bd.chat.findFirst({
            where: {
                user1_id: sortedUsers[0],
                user2_id: sortedUsers[1]
            }
        });

        if (existingChat) {
            console.log('ℹ️ Чат уже существует, ID:', existingChat.id);
            return existingChat;
        }

        // Создаем новый чат
        const newChat = await bd.chat.create({
            data: {
                user1_id: sortedUsers[0],
                user2_id: sortedUsers[1]
            }
        });

        console.log('✅ Создан новый чат, ID:', newChat.id);
        return newChat;

    } catch (error) {
        console.error('❌ Ошибка при создании чата:', error);
        throw error;
    }
};

// Принять заявку в друзья
exports.acceptFriendRequest = async (friendshipId, acceptorId) => {
    try {
        console.log('Принятие заявки:', { friendshipId, acceptorId });

        // Находим заявку в друзья
        const friendship = await bd.friends.findFirst({
            where: { 
                id: parseInt(friendshipId),
                user2_id: parseInt(acceptorId),
                status: 'Expectation'
            }
        });

        if (!friendship) {
            throw new Error('Заявка не найдена');
        }

        // Обновляем статус заявки на "принято"
        const updatedFriendship = await bd.friends.update({
            where: { id: parseInt(friendshipId) },
            data: { status: 'Accepted' }
        });

        console.log('✅ Заявка принята, обновленная запись:', updatedFriendship);

        // СОЗДАЕМ ЧАТ МЕЖДУ ПОЛЬЗОВАТЕЛЯМИ
        try {
            await createChatBetweenUsers(friendship.user1_id, friendship.user2_id);
            console.log('✅ Чат успешно создан');
        } catch (chatError) {
            console.error('⚠️ Ошибка при создании чата, но дружба установлена:', chatError.message);
            // Не прерываем выполнение - дружба уже установлена
        }

        return updatedFriendship;

    } catch (error) {
        console.error('❌ Ошибка при принятии заявки:', error);
        throw error;
    }
};


exports.createChatBetweenUsers = createChatBetweenUsers;

// Отклонить заявку в друзья
exports.rejectFriendRequest = async (friendshipId, userId) => {
    console.log('Отклонение заявки:', { friendshipId, userId });

    const friendship = await bd.friends.findFirst({
        where: {
            id: parseInt(friendshipId),
            user2_id: parseInt(userId),
            status: 'Expectation'
        }
    });

    if (!friendship) {
        throw new Error('Заявка не найдена');
    }

    const result = await bd.friends.delete({
        where: { id: parseInt(friendshipId) }
    });

    console.log('Заявка удалена:', result);
    return result;
};

// Отправить заявку в друзья
exports.sendFriendRequest = async (user1Id, user2Id) => {
    // Проверяем, не существует ли уже связи
    const existingFriendship = await bd.friends.findFirst({
        where: {
            OR: [
                { user1_id: parseInt(user1Id), user2_id: parseInt(user2Id) },
                { user1_id: parseInt(user2Id), user2_id: parseInt(user1Id) }
            ]
        }
    });

    if (existingFriendship) {
        throw new Error('Заявка уже существует');
    }

    // Создаем новую заявку
    return await bd.friends.create({
        data: {
            user1_id: parseInt(user1Id),
            user2_id: parseInt(user2Id),
            status: 'Expectation'
        }
    });
};