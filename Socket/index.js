const io = require("socket.io")(8000, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // adding new user
  // console.log(`Client connected: ${socket.id}`);
  socket.on("add-new-user", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    // console.log("Connected User", activeUsers);
    io.emit("get-users", activeUsers);
  });
  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    // console.log("User Disconnected", activeUsers);
    io.emit("get-users", activeUsers);
  });
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.socketId !== socket.id);
    // console.log("sending from socket: ", receiverId);
    // console.log(data);
    if (user) {
      io.to(user.socketId).emit("receive-message", data);
    }
  });
});
