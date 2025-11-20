
const WebSocket = require('ws');

class WebSocketServer {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.connections = new Map();
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            console.log('🔌 Новое WebSocket соединение');

            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    
                    // Регистрация пользователя
                    if (data.type === 'register' && data.userId) {
                        this.connections.set(data.userId, ws);
                        console.log(`👤 Пользователь ${data.userId} подключен к WebSocket`);
                    }
                    
                    // Отправка сообщения
                    if (data.type === 'message' && data.receiverId) {
                        this.sendToUser(data.receiverId, {
                            type: 'new_message',
                            message: data.message,
                            chatId: data.chatId
                        });
                    }
                    
                } catch (error) {
                    console.error('❌ Ошибка обработки WebSocket сообщения:', error);
                }
            });

            ws.on('close', () => {
                this.removeConnection(ws);
            });

            ws.on('error', (error) => {
                console.error('❌ WebSocket ошибка:', error);
                this.removeConnection(ws);
            });
        });
    }

    sendToUser(userId, data) {
        const userWs = this.connections.get(userId);
        if (userWs && userWs.readyState === WebSocket.OPEN) {
            userWs.send(JSON.stringify(data));
            console.log(`📨 Сообщение отправлено пользователю ${userId}`);
            return true;
        }
        console.log(`⚠️ Пользователь ${userId} не подключен к WebSocket`);
        return false;
    }

    removeConnection(ws) {
        for (let [userId, connection] of this.connections.entries()) {
            if (connection === ws) {
                this.connections.delete(userId);
                console.log(`👤 Пользователь ${userId} отключен от WebSocket`);
                break;
            }
        }
    }
}

module.exports = WebSocketServer;