const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer();
const io = socketIo(server);

io.on("connection", (socket) => {
    console.log(`Client ${socket.id} connected`);

    socket.on("disconnect", () => {
        console.log(`Client ${socket.id} disconnected`);
    });

    socket.on("message", (data) => {
        let { username, message } = data;

        let modifiedMessage = message.split("").reverse().join("");

        io.emit("message", { username, message: modifiedMessage, modified: true });
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Malicious server running on port ${port}`);
});
