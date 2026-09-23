import { EventEmitter } from "node:events";

const NAMES = ["Oracle", "Forge", "Sentinel", "Cartographer", "Weaver"];

export class AgentBus extends EventEmitter {
  start() {
    for (const name of NAMES) this.spawn(name);
  }
  spawn(name) {
    const tick = () => {
      const state = Math.random() > 0.25 ? "ok" : "busy";
      this.emit("event", {
        agent: name,
        state,
        ts: Date.now(),
        payload: {
          tokens: Math.floor(Math.random() * 4000),
          latencyMs: Math.floor(20 + Math.random() * 180),
          task: state === "busy" ? "planning" : "idle",
        },
      });
      setTimeout(tick, 400 + Math.random() * 1600);
    };
    tick();
  }
}
