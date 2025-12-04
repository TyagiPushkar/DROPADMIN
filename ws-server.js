import { WebSocketServer } from "ws";

const wss = new WebSocketServer({
    port: 6010,
    host: "0.0.0.0"  
});

wss.on("connection", (ws) => {
    console.log("Restaurant connected");

    ws.on("message", (message) => {
        console.log("Received:", message.toString());

        wss.clients.forEach(client => {
            if (client.readyState === 1) {
                client.send(message.toString());
            }
        });
    });
});

console.log("WS Server running on ws://139.5.190.143:6010");
