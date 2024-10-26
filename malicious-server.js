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

        let modifiedMessage = message + " (edit)";

        const generatedHash = generateHash(modifiedMessage);

        if (messageHash !== generatedHash) {
            message = message + " (modified by server)";
        }

        io.emit("message", { username, message, modified: true });
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Malicious server running on port ${port}`);
});
