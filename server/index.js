import { createServer } from "http";
import { Server } from "socket.io";
import { Groups } from "./Data.js";
import { sockets } from "./sockets.js";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"],
      credentials: true
  }
});

let groups = new Groups();
let users = {}; 

io.on('connection', function (socket) {
  sockets(this, socket, users, groups);
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, function() {
    console.log("Socket.io server running on http://localhost:" + PORT);
});