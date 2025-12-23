import { createServer } from "http";
import { Server } from "socket.io";
import {Data, Groups} from "./Data.js";
import { sockets } from "./sockets.js";


const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
      origin: "*", //tillåter alla anslutningar, ex. mobil
      methods: ["GET", "POST"],
      credentials: true
  }
});

// Read in the "class" to store all our data on the server side
// If you need to change how data is handled, check the Data.js file!

//import { Data } from "./Data.js";
//import {Groups} from "./Data.js";
//import { Users } from "./users.js";
//


let data = new Data();
//let users = new Users();
let groups = new Groups();
let users = {}; // Temporarily using a simple object for users until Users class is implemented

io.on('connection', function (socket) {
  sockets(this, socket, data,  users, groups);
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, function() {
    console.log("Socket.io server running on http://localhost:" + PORT);
});
