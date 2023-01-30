import { io } from "socket.io-client";
import pino from "pino";
import short from "short-uuid";
import * as dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

const logger = pino();
const port = process.env.PORT | 3000;
const environment = process.env.NODE_ENV || "development";
logger.info(`Environment: ${environment}`);
const clientId = short.generate();

const wsServer =
  environment === "production"
    ? process.env.WS_URL
    : process.env.WS_URL || `http://localhost:${port}`;
logger.info(`Connecting to ${wsServer}`);

const socket = io(wsServer, { transports: ["websocket"], requestTimeout: 20 });

logger.info(`I am client ${clientId}`);

socket.on("connect", () => {
  logger.info(`Connect`);
});

socket.on("disconnect", () => {
  logger.info(`Disconnect`);
});

socket.on("error", () => {
  logger.info(`Error connecting to ${wsServer}: ${error}`);
});

socket.io.on("reconnect", (attempt) => {
  logger.info(`Reconnecting to ${wsServer}: attempt ${attempt}`);
});

socket.io.on("reconnect_attempt", (attempt) => {
  logger.info(`Reconnect attempt to ${wsServer}: attempt ${attempt}`);
});

socket.io.on("reconnect_error", (error) => {
  logger.error(`Reconnect error to ${wsServer}: ${error}`);
});

socket.io.on("reconnect_failed", () => {
  logger.error(`Reconnect failed to ${wsServer}`);
});

setInterval(() => {
  socket.emit("hey", { timestamp: Date.now() });
}, 1000);

socket.on("status", (data) => {
  const { timestamp, numClients, serverId } = data;
  const lagInMillis = Date.now() - timestamp;
  logger.info(
    `Server ${serverId} (${numClients} clients) - Lag from server: ${lagInMillis} ms`
  );
});
