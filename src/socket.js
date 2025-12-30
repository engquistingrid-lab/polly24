import io from "socket.io-client";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const socket = io(serverUrl);

console.log(`🔌 Socket initierad mot: ${serverUrl}`);

export default socket;