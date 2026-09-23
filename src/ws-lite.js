import { createHash } from "node:crypto";

function acceptKey(key) {
  return createHash("sha1")
    .update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
    .digest("base64");
}

function encode(data) {
  const payload = Buffer.from(data);
  const len = payload.length;
  let header;
  if (len < 126) {
    header = Buffer.from([0x81, len]);
  } else {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  }
  return Buffer.concat([header, payload]);
}

export class WebSocketServer {
  constructor(server, path) {
    this.clients = new Set();
    server.on("upgrade", (req, socket) => {
      if (req.url !== path) {
        socket.destroy();
        return;
      }
      const key = req.headers["sec-websocket-key"];
      if (!key) {
        socket.destroy();
        return;
      }
      socket.write(
        "HTTP/1.1 101 Switching Protocols\r\n" +
          "Upgrade: websocket\r\nConnection: Upgrade\r\n" +
          `Sec-WebSocket-Accept: ${acceptKey(key)}\r\n\r\n`
      );
      this.clients.add(socket);
      socket.on("close", () => this.clients.delete(socket));
      socket.on("error", () => this.clients.delete(socket));
    });
  }
  broadcast(msg) {
    const frame = encode(msg);
    for (const c of this.clients) {
      try {
        c.write(frame);
      } catch {
        this.clients.delete(c);
      }
    }
  }
}
