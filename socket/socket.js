const socketIO = require('socket.io');
const Coffeeshop = require('../model/coffeeshop');

let io;

function initializeSocket(server) {
    io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
        socket.on('getMessages', async (data) => {
            try {
                const { usernameshop, sender } = data;
                const shop = await Coffeeshop.findOne({ usernameshop }, 'messages');
                if (!shop) {
                    socket.emit('shopNotFound');
                    return;
                }
                const filteredMessages = shop.messages.filter((message) => message.sender === sender);
                socket.emit('filteredMessages', filteredMessages);
            } catch (error) {
                console.error('Error:', error);
                socket.emit('serverError', 'Server error');
            }
        });
        socket.on('chatMessage', async (data) => {
            try {
                const { sender, recipient, content } = data;
                const shop = await Coffeeshop.findOne({ usernameshop: recipient });

                if (!shop) {
                    socket.emit('shopNotFound');
                    return;
                }
                const existingMessageIndex = shop.messages.findIndex((message) => message.sender === sender);

                if (existingMessageIndex === -1) {
                    const newMessage = {
                        sender,
                        sendermeseger: [
                            {
                                content,
                                createdAt: Date.now(),
                            },
                        ],
                    };
                    shop.messages.push(newMessage);
                } else {
                    const existingMessage = shop.messages[existingMessageIndex];
                    if (!Array.isArray(existingMessage.sendermeseger)) {
                        // Nếu không phải là mảng, chuyển đổi thành mảng bằng cách tạo một mảng mới với phần tử hiện tại
                        existingMessage.sendermeseger = [existingMessage.sendermeseger];
                    }
                    existingMessage.sendermeseger.push({
                        content,
                        createdAt: Date.now(),
                    });
                }

                await shop.save();
                io.to(recipient).emit('newMessage', { sender, content });
            } catch (error) {
                console.error('Error:', error);
                socket.emit('serverError', 'Server error');
            }
        });
    });
}

function getIo() {
    if (!io) {
        throw new Error('Socket.IO has not been initialized.');
    }
    return io;
}

module.exports = {
    initializeSocket,
    getIo,
};
