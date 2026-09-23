# AetherForge

Zero-dependency Node.js live **multi-agent fabric**. Five simulated specialists stream state over a hand-rolled WebSocket server into a dark dashboard.

## Why it exists
Shows a production-shaped pattern: HTTP + protocol upgrade, binary WS frames, an event bus, and a browser observer — without `ws` or Express.

## Run
```bash
node src/server.js
# open http://localhost:8787
```

Requires Node 18+.

## Layout
```
src/server.js   HTTP + dashboard
src/ws-lite.js  RFC6455 subset (text frames)
src/agents.js   stochastic agent bus
```
