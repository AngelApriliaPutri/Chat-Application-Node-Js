const http = require("http");
const socketIo = require("socket.io");
const crypto = require("crypto");

const server = http.createServer();
const io = socketIo(server);

function generateHash(message) {
    return crypto.createHash('sha256').update(message).digest('hex');
}

io.on("connection", (socket) => {
    console.log(`Client ${socket.id} connected`);

    socket.on("disconnect", () => {
        console.log(`Client ${socket.id} disconnected`);
    });

    socket.on("message", (data) => {
        let { username, message, messageHash } = data;

        const generatedHash = generateHash(message);

        if (messageHash === generatedHash) {
            console.log(`Message from ${username}: ${message}`);

            io.emit("message", { username, message, modified: false });
        }
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
