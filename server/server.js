import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import short from "short-uuid";
import pino from "pino";

let lags = [];
const sizeLags = 20;
const logger = pino();
const serverId = short.generate().slice(0, 3);

export function start(httpServer, port, pubClient, subClient) {
  const io = new Server(httpServer, {});

  io.adapter(createAdapter(pubClient, subClient));

  io.on("connection", (socket) => {
    logger.info(`New client added, ${io.engine.clientsCount} in total.`);

    socket.on("message", ({ id: clientId }) => {
      logger.info(`Client ${clientId} is here`);
      io.emit("all", `Client ${clientId} says hi!`);
    });

    socket.on("hey", (data) => {
      const { timestamp } = data;
      const lagInMillis = Date.now() - timestamp;
      socket.emit("status", {
        timestamp: Date.now(),
        numClients: io.engine.clientsCount,
        serverId,
      });
      if (lags.length >= sizeLags) {
        lags.shift();
      }
      lags.push(lagInMillis);
    });
  });

  setInterval(() => {
    let avg;
    if (lags.length) {
      let total = lags.reduce((acc, curr) => acc + curr, 0);
      avg = Math.round(total / lags.length);
    }
    const avgMessage = avg ? `, ${avg}ms avg lag` : "";
    logger.info(`${io.engine.clientsCount} clients${avgMessage}`);
  }, 5000);

  httpServer.listen(port, () => logger.info(`Listening on port ${port}`));
}
