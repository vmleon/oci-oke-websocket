import { io } from "socket.io-client";
import pino from "pino";
import short from "short-uuid";

const logger = pino();
const port = process.env.PORT | 3000;
const environment = process.env.NODE_ENV | "development";
const clientId = short.generate();

const wsServer = environment === "production" ? "" : `http://localhost:${port}`;
logger.info(`Connecting to ${wsServer}`);

const socket = io(wsServer, { transports: ["websocket"] });

logger.info(`I am client ${clientId}`);

socket.on("connect", () => {
  logger.info(`Connect`);
});

socket.on("disconnect", () => {
  logger.info(`Disconnect`);
});

setInterval(() => {
  socket.emit("hey", { timestamp: Date.now() });
}, 1000);

socket.on("status", (data) => {
  const {
    lagInMillis: lagInMillisOnServer,
    timestamp,
    numClients,
    serverId,
  } = data;
  const now = Date.now();
  const lagInMillisOnClient = now - timestamp;
  logger.info(
    `Server ${serverId} (${numClients} clients) - Lag server[${lagInMillisOnServer}ms]/[${lagInMillisOnClient}ms]client`
  );
});
