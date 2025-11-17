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

    // ✅ Преобразуем чтобы вернуть только информацию о друге (не о текущем пользователе)
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
            user2_id: parseInt(userId), // заявки где текущий пользователь - получатель
            status: 'Expectation'
        },
        include: {
            user1: { // отправитель заявки
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
            id: 'desc' // сортировка по дате (новые сначала)
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
            user1_id: parseInt(userId), // заявки где текущий пользователь - отправитель
            status: 'Expectation'
        },
        include: {
            user2: { // получатель заявки
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

// Принять заявку в друзья
exports.acceptFriendRequest = async (friendshipId, userId) => {
    const friendship = await bd.friends.findFirst({
        where: {
            id: parseInt(friendshipId),
            user2_id: parseInt(userId), // проверяем что заявка адресована текущему пользователю
            status: 'Expectation'
        }
    });

    if (!friendship) {
        throw new Error('Заявка не найдена');
    }

    return await bd.friends.update({
        where: { id: parseInt(friendshipId) },
        data: { status: 'Accepted' }
    });
};

// Отклонить заявку в друзья
exports.rejectFriendRequest = async (friendshipId, userId) => {
    console.log('Поиск заявки:', { friendshipId, userId });
    
    const friendship = await bd.friends.findFirst({
        where: {
            id: parseInt(friendshipId),
            user2_id: parseInt(userId),
            status: 'Expectation'
        }
    });

    console.log('Найдена заявка:', friendship);

    if (!friendship) {
        // Проверим, существует ли заявка вообще
        const anyFriendship = await bd.friends.findFirst({
            where: {
                id: parseInt(friendshipId)
            }
        });
        console.log('Любая заявка с этим ID:', anyFriendship);
        
        throw new Error('Заявка не найдена');
    }

    const result = await bd.friends.delete({
        where: { id: parseInt(friendshipId) }
    });
    
    console.log('Заявка удалена:', result);
    return result;
};