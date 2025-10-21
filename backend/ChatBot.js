// store users
const users = new Map();

// When a user joins
socket.on("join", (username) => {
    users.set(socket.id, username);
    io.emit("users", Array.from(users.values()));
    io.emit("message", {
        sender: "System",
        text: `${username} joined the chat`,
        time: new Date(),
    });
});

// When a message is sent
socket.on("message", (text) => {
    const sender = users.get(socket.id);
    if (!sender) return;
    const msg = { sender, text, time: new Date() };
    io.emit("message", msg);
});

// When a user disconnects
socket.on("disconnect", () => {
    const username = users.get(socket.id);
    if (username) {
        users.delete(socket.id);
        io.emit("users", Array.from(users.values()));
        io.emit("message", {
            sender: "System",
            text: `${username} left the chat`,
            time: new Date(),
        });
    }
});
