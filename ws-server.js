import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
    console.log("Restaurant connected");

    ws.on("message", (message) => {
        console.log("Received:", message.toString());

        // 🔥 BROADCAST MESSAGE TO ALL CLIENTS
        wss.clients.forEach(client => {
            if (client.readyState === 1) {
                client.send(message.toString());
            }
        });
    });
});

console.log("WS Server running on ws://localhost:8080");
