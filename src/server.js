import http from "node:http";
import { WebSocketServer } from "./ws-lite.js";
import { AgentBus } from "./agents.js";

const PORT = Number(process.env.PORT || 8787);
const bus = new AgentBus();

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>AetherForge</title>
  <style>
    :root { color-scheme: dark; }
    body { font-family: ui-sans-serif, system-ui; margin: 0; background: #0b1020; color: #e8eefc; }
    header { padding: 16px 24px; border-bottom: 1px solid #1e2a4a; }
    h1 { margin: 0; font-size: 20px; letter-spacing: .08em; }
    #grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); gap: 12px; padding: 16px; }
    .card { background: #121a33; border: 1px solid #243258; border-radius: 12px; padding: 14px; }
    .ok { color: #6ee7b7; } .busy { color: #fbbf24; }
    pre { font-size: 12px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <header><h1>AETHERFORGE · live agent fabric</h1></header>
  <div id="grid"></div>
  <script>
    const grid = document.getElementById("grid");
    const cards = new Map();
    const ws = new WebSocket("ws://" + location.host + "/bus");
    ws.onmessage = (e) => {
      const ev = JSON.parse(e.data);
      let el = cards.get(ev.agent);
      if (!el) {
        el = document.createElement("div");
        el.className = "card";
        cards.set(ev.agent, el);
        grid.appendChild(el);
      }
      el.innerHTML = "<strong>" + ev.agent + "</strong> · <span class='" + ev.state + "'>" + ev.state +
        "</span><pre>" + JSON.stringify(ev.payload, null, 2) + "</pre>";
    };
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/index.html") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(html);
    return;
  }
  res.writeHead(404);
  res.end("not found");
});

const wss = new WebSocketServer(server, "/bus");
bus.on("event", (ev) => wss.broadcast(JSON.stringify(ev)));
bus.start();

server.listen(PORT, () => {
  console.log(`AetherForge dashboard → http://localhost:${PORT}`);
});
