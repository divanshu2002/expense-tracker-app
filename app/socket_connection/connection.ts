import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

// curl "http://localhost:3000/socket.io/?EIO=4&transport=polling"
