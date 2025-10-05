import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => res.send("✅ Signaling Server Running"));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Signaling server on port ${process.env.PORT || 5000}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🔗 Client connected");

  ws.on("message", (message) => {
    // broadcast to all other clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => console.log("❌ Client disconnected"));
});
