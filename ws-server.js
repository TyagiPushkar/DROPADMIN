// websocket-server.js
import { WebSocketServer } from "ws";

const PORT = process.env.WS_PORT || 6010;
const HOST = process.env.WS_HOST || "0.0.0.0";

const wss = new WebSocketServer({
  port: PORT,
  host: HOST,
});

wss.on("connection", (ws) => {
  console.log("Restaurant connected");

  ws.on("message", (message) => {
    console.log("Received:", message.toString());

    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(message.toString());
      }
    });
  });
});

console.log(`WS Server running on ws://${HOST}:${PORT}`);
