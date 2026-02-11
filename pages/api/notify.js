// pages/api/notify.js
import WebSocket from "ws";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Optional: Restrict to your PHP server IP
  // const allowedIP = '139.5.190.143';
  // if (req.socket.remoteAddress !== allowedIP) {
  //     return res.status(403).json({ error: 'Forbidden' });
  // }

  try {
    const data = req.body;

    // Connect to local WebSocket server
    const ws = new WebSocket("ws://localhost:6011");

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("WebSocket connection timeout"));
      }, 3000);

      ws.on("open", () => {
        ws.send(JSON.stringify(data));
        ws.close();
        clearTimeout(timeout);
        resolve();
      });

      ws.on("error", (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Notification API error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
