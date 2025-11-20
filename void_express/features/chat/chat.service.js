const bd = require('../../utils/configuration.prisma');


exports.getUserChats = async (userId) => {
    // Находим все чаты, где пользователь является участником через дружбу
    const chats = await bd.chat.findMany({
        where: {
            OR: [
                {
                    user1: {
                        OR: [
                            { user1_id: parseInt(userId) },
                            { user2_id: parseInt(userId) }
                        ]
                    }
                },
                {
                    user2: {
                        OR: [
                            { user1_id: parseInt(userId) },
                            { user2_id: parseInt(userId) }
                        ]
                    }
                }
            ]
        },
        include: {
            user1: {
                include: {
                    user1: {
                        select: {
                            id: true,
                            name: true,
                            last_name: true,
                            login: true,
                            avatar: true
                        }
                    },
                    user2: {
                        select: {
                            id: true,
                            name: true,
                            last_name: true,
                            login: true,
                            avatar: true
                        }
                    }
                }
            },
            messages: {
                orderBy: { created_at: 'desc' },
                take: 1,
                select: {
                    message_text: true,
                    created_at: true,
                    is_read: true,
                    sender_id: true
                }
            },
            _count: {
                select: {
                    messages: {
                        where: {
                            is_read: false,
                            NOT: {
                                sender_id: parseInt(userId)
                            }
                        }
                    }
                }
            }
        },
        orderBy: {
            messages: {
                _count: 'desc'
            }
        }
    });

    // Форматируем ответ
    return chats.map(chat => {
        // Определяем, кто из пользователей является другом
        const currentUserId = parseInt(userId);
        let friend = null;

        // Друг - это тот, кто НЕ текущий пользователь в дружбе
        if (chat.user1.user1_id === currentUserId) {
            friend = chat.user1.user2;
        } else {
            friend = chat.user1.user1;
        }

        const lastMessage = chat.messages[0] || null;

        return {
            id: chat.id,
            friend: {
                id: friend.id,
                name: friend.name,
                last_name: friend.last_name,
                login: friend.login,
                avatar: friend.avatar,
                full_name: `${friend.name} ${friend.last_name}`
            },
            last_message: lastMessage ? {
                text: lastMessage.message_text,
                time: lastMessage.created_at,
                is_read: lastMessage.is_read,
                is_my_message: lastMessage.sender_id === currentUserId
            } : null,
            unread_count: chat._count.messages,
            created_at: chat.created_at
        };
    });
};



exports.getChatMessages = async (chatId, userId) => {
    // Находим чат с информацией о дружбе
    const chat = await bd.chat.findUnique({
        where: { id: parseInt(chatId) },
        include: {
            user1: {
                include: {
                    user1: true,
                    user2: true
                }
            }
        }
    });

    if (!chat) {
        throw new Error('Нет доступа к чату или чат не найден');
    }

    // Проверяем что пользователь является участником этой дружбы
    const isParticipant = chat.user1.user1_id === parseInt(userId) ||
        chat.user1.user2_id === parseInt(userId);

    if (!isParticipant) {
        throw new Error('Нет доступа к чату или чат не найден');
    }

    const messages = await bd.message.findMany({
        where: {
            chat_id: parseInt(chatId)
        },
        include: {
            MessageUser: {
                select: {
                    id: true,
                    name: true,
                    last_name: true,
                    avatar: true,
                    login: true
                }
            }
        },
        orderBy: {
            created_at: 'asc'
        }
    });

    // Помечаем сообщения как прочитанные
    await bd.message.updateMany({
        where: {
            chat_id: parseInt(chatId),
            sender_id: { not: parseInt(userId) },
            is_read: false
        },
        data: {
            is_read: true
        }
    });

    return messages.map(message => ({
        id: message.id,
        text: message.message_text,
        is_read: message.is_read,
        created_at: message.created_at,
        sender: {
            id: message.MessageUser.id,
            name: message.MessageUser.name,
            last_name: message.MessageUser.last_name,
            avatar: message.MessageUser.avatar,
            login: message.MessageUser.login,
            is_me: message.MessageUser.id === parseInt(userId)
        }
    }));
};





exports.sendMessage = async (chatId, senderId, messageText) => {
    // Находим чат с информацией о дружбе
    const chat = await bd.chat.findUnique({
        where: { id: parseInt(chatId) },
        include: {
            user1: {
                include: {
                    user1: true,
                    user2: true
                }
            }
        }
    });

    if (!chat) {
        throw new Error('Нет доступа к чату');
    }

    // Проверяем что пользователь является участником этой дружбы
    const isParticipant = chat.user1.user1_id === parseInt(senderId) ||
        chat.user1.user2_id === parseInt(senderId);

    if (!isParticipant) {
        throw new Error('Нет доступа к чату');
    }

    // Создаем сообщение
    const message = await bd.message.create({
        data: {
            chat_id: parseInt(chatId),
            sender_id: parseInt(senderId),
            message_text: messageText
        },
        include: {
            MessageUser: {
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

    return {
        id: message.id,
        text: message.message_text,
        is_read: message.is_read,
        created_at: message.created_at,
        sender: {
            id: message.MessageUser.id,
            name: message.MessageUser.name,
            last_name: message.MessageUser.last_name,
            avatar: message.MessageUser.avatar,
            login: message.MessageUser.login,
            is_me: true
        }
    };
};


// Пометить сообщения как прочитанные
exports.markMessagesAsRead = async (chatId, userId) => {
    await bd.message.updateMany({
        where: {
            chat_id: parseInt(chatId),
            sender_id: { not: parseInt(userId) },
            is_read: false
        },
        data: {
            is_read: true
        }
    });
};


// Получить или создать чат с другом
exports.getOrCreateChat = async (user1Id, user2Id) => {
    console.log('🔍 Поиск дружбы между:', user1Id, 'и', user2Id);

    // Проверяем являются ли пользователи друзьями
    const areFriends = await bd.friends.findFirst({
        where: {
            OR: [
                {
                    user1_id: parseInt(user1Id),
                    user2_id: parseInt(user2Id),
                    status: 'Accepted'
                },
                {
                    user1_id: parseInt(user2Id),
                    user2_id: parseInt(user1Id),
                    status: 'Accepted'
                }
            ]
        }
    });

    console.log('📊 Найдена дружба:', areFriends);

    if (!areFriends) {
        throw new Error('Пользователи не являются друзьями');
    }

    // Ищем существующий чат по ID пользователей из дружбы
    let chat = await bd.chat.findFirst({
        where: {
            OR: [
                { user1_id: areFriends.id },
                { user2_id: areFriends.id }
            ]
        },
        include: {
            user1: {
                include: {
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
            },
            user2: {
                include: {
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
            }
        }
    });

    console.log('📊 Найден чат:', chat);

    // Если чата нет - создаем
    if (!chat) {
        console.log('➕ Создаем новый чат с Friends.id:', areFriends.id);

        // ИСПРАВЬ НА ЭТО:
        chat = await bd.chat.create({
            data: {
                user1_id: areFriends.id, // ID дружбы
                user2_id: areFriends.id  // ID дружбы
            },
            include: {
                user1: {
                    include: {
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
                },
                user2: {
                    include: {
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
                }
            }
        });

        console.log('✅ Чат создан:', chat);
    }

    // Определяем, кто из пользователей является другом
    const currentUserId = parseInt(user1Id);
    let friendUser = null;

    if (areFriends.user1_id === currentUserId) {
        // Друг - user2
        friendUser = await bd.user.findUnique({
            where: { id: areFriends.user2_id },
            select: {
                id: true,
                name: true,
                last_name: true,
                avatar: true,
                login: true
            }
        });
    } else {
        // Друг - user1
        friendUser = await bd.user.findUnique({
            where: { id: areFriends.user1_id },
            select: {
                id: true,
                name: true,
                last_name: true,
                avatar: true,
                login: true
            }
        });
    }

    console.log('👤 Данные друга:', friendUser);

    return {
        id: chat.id,
        friend: {
            id: friendUser.id,
            name: friendUser.name,
            last_name: friendUser.last_name,
            avatar: friendUser.avatar,
            login: friendUser.login,
            full_name: `${friendUser.name} ${friendUser.last_name}`
        },
        created_at: chat.created_at
    };
};




// Получить информацию о чате
exports.getChatInfo = async (chatId, userId) => {
    // Находим чат с информацией о дружбе
    const chat = await bd.chat.findUnique({
        where: { id: parseInt(chatId) },
        include: {
            user1: {  // это связь с Friends
                include: {
                    user1: true,  // первый пользователь дружбы
                    user2: true   // второй пользователь дружбы
                }
            },
            user2: {  // это тоже связь с Friends (дублирует ту же дружбу)
                include: {
                    user1: true,
                    user2: true
                }
            }
        }
    });

    if (!chat) {
        throw new Error('Чат не найден');
    }

    // Проверяем что пользователь является участником этой дружбы
    const isParticipant = chat.user1.user1_id === parseInt(userId) ||
        chat.user1.user2_id === parseInt(userId);

    if (!isParticipant) {
        throw new Error('Нет доступа к чату');
    }

    // Определяем кто из пользователей является другом
    let friendUser = null;
    if (chat.user1.user1_id === parseInt(userId)) {
        friendUser = chat.user1.user2;  // друг - user2
    } else {
        friendUser = chat.user1.user1;  // друг - user1
    }

    return {
        id: chat.id,
        friend: {
            id: friendUser.id,
            name: friendUser.name,
            last_name: friendUser.last_name,
            avatar: friendUser.avatar,
            login: friendUser.login,
            full_name: `${friendUser.name} ${friendUser.last_name}`
        },
        created_at: chat.created_at
    };
};



// В chat.service.js добавьте эту функцию
exports.checkAndCreateChatsForExistingFriendships = async () => {
    try {
        console.log('🔍 Проверка дружб без чатов...');

        // Находим все принятые дружбы
        const friendships = await bd.friends.findMany({
            where: {
                status: 'Accepted'
            },
            include: {
                chatUser1: true,
                chatUser2: true
            }
        });

        let createdChats = 0;

        for (const friendship of friendships) {
            // Проверяем существует ли чат для этой дружбы
            const existingChat = await bd.chat.findFirst({
                where: {
                    OR: [
                        { user1_id: friendship.id },
                        { user2_id: friendship.id }
                    ]
                }
            });

            if (!existingChat) {
                // Создаем чат
                await bd.chat.create({
                    data: {
                        user1_id: friendship.id,
                        user2_id: friendship.id
                    }
                });
                createdChats++;
                console.log(`✅ Создан чат для дружбы ${friendship.id}`);
            }
        }

        console.log(`🎉 Создано ${createdChats} новых чатов`);
        return createdChats;

    } catch (error) {
        console.error('❌ Ошибка при проверке чатов:', error);
        throw error;
    }
};



exports.getReceiverId = async (chatId, senderId) => {
    try {
        const chat = await bd.chat.findUnique({
            where: { id: parseInt(chatId) },
            include: {
                user1: {
                    include: {
                        user1: true,
                        user2: true
                    }
                }
            }
        });

        if (!chat) return null;

        // Определяем ID получателя
        if (chat.user1.user1_id === parseInt(senderId)) {
            return chat.user1.user2_id;
        } else {
            return chat.user1.user1_id;
        }
    } catch (error) {
        console.error('❌ Ошибка получения ID получателя:', error);
        return null;
    }
};