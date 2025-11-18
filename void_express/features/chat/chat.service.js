const bd = require('../../utils/configuration.prisma');

// Получить все чаты пользователя
exports.getUserChats = async (userId) => {
    const chats = await bd.chat.findMany({
        where: {
            OR: [
                { user1_id: parseInt(userId) },
                { user2_id: parseInt(userId) }
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
            user2: {
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
        
        if (chat.user1_id === currentUserId) {
            // Если текущий пользователь - user1, то друг - user2
            friend = chat.user2.user1.id === currentUserId ? chat.user2.user2 : chat.user2.user1;
        } else {
            // Если текущий пользователь - user2, то друг - user1
            friend = chat.user1.user1.id === currentUserId ? chat.user1.user2 : chat.user1.user1;
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

// Получить сообщения чата
exports.getChatMessages = async (chatId, userId) => {
    // Проверяем доступ пользователя к чату
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

// Отправить сообщение
exports.sendMessage = async (chatId, senderId, messageText) => {
    // Проверяем доступ пользователя к чату
    const chat = await bd.chat.findFirst({
        where: {
            id: parseInt(chatId),
            OR: [
                { user1_id: parseInt(senderId) },
                { user2_id: parseInt(senderId) }
            ]
        }
    });

    if (!chat) {
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
    // Проверяем являются ли пользователи друзьями
    const areFriends = await bd.friends.findFirst({
        where: {
            OR: [
                { user1_id: parseInt(user1Id), user2_id: parseInt(user2Id), status: 'Accepted' },
                { user1_id: parseInt(user2Id), user2_id: parseInt(user1Id), status: 'Accepted' }
            ]
        }
    });

    if (!areFriends) {
        throw new Error('Пользователи не являются друзьями');
    }

    // Упорядочиваем ID для consistent поиска
    const sortedUsers = [parseInt(user1Id), parseInt(user2Id)].sort((a, b) => a - b);

    // Ищем существующий чат
    let chat = await bd.chat.findFirst({
        where: {
            user1_id: sortedUsers[0],
            user2_id: sortedUsers[1]
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

    // Если чата нет - создаем
    if (!chat) {
        chat = await bd.chat.create({
            data: {
                user1_id: sortedUsers[0],
                user2_id: sortedUsers[1]
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
    }

    // Определяем, кто из пользователей является другом
    const currentUserId = parseInt(user1Id);
    let friend = null;
    
    if (chat.user1_id === currentUserId) {
        friend = chat.user2.user1.id === currentUserId ? chat.user2.user2 : chat.user2.user1;
    } else {
        friend = chat.user1.user1.id === currentUserId ? chat.user1.user2 : chat.user1.user1;
    }

    return {
        id: chat.id,
        friend: {
            id: friend.id,
            name: friend.name,
            last_name: friend.last_name,
            avatar: friend.avatar,
            login: friend.login,
            full_name: `${friend.name} ${friend.last_name}`
        },
        created_at: chat.created_at
    };
};


// Получить информацию о чате
exports.getChatInfo = async (chatId, userId) => {
    // Проверяем доступ пользователя к чату
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
        throw new Error('Чат не найден');
    }

    // Определяем ID друга
    const friendId = chat.user1_id === parseInt(userId) ? chat.user2_id : chat.user1_id;
    
    // Получаем информацию о друге
    const friend = await bd.user.findUnique({
        where: { id: friendId },
        select: {
            id: true,
            name: true,
            last_name: true,
            login: true,
            avatar: true
        }
    });

    return {
        id: chat.id,
        friend: {
            ...friend,
            full_name: `${friend.name} ${friend.last_name}`
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