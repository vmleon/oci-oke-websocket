import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import { createTerminus } from "@godaddy/terminus";
import { TDigest } from "tdigest";
import pino from "pino";
import short from "short-uuid";
import * as dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

const logger = pino();
const port = process.env.PORT | 3000;
const environment = process.env.NODE_ENV || "development";
logger.info(`Environment: ${environment}`);
const serverId = short.generate();
const td = new TDigest();

let lags = [];
const sizeLags = 20;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

function onSignal() {
  console.log("server is starting cleanup");
}

async function onHealthCheck() {
  return;
}

createTerminus(httpServer, {
  signal: "SIGINT",
  healthChecks: { "/healthz": onHealthCheck },
  onSignal,
});

io.on("connection", (socket) => {
  logger.info(
    `New client ${socket.id} added, ${io.engine.clientsCount} in Total.`
  );

  socket.on("hey", (data) => {
    const { timestamp } = data;
    const now = Date.now();
    const lagInMillis = now - timestamp;
    socket.emit("status", {
      lagInMillis,
      timestamp: now,
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
    td.push(lags);
    td.compress();
    avg = Math.round(td.percentile(0.5));
  }
  const avgMessage = avg ? `, ${avg}ms avg lag` : "";
  logger.info(`${io.engine.clientsCount} clients${avgMessage}`);
}, 5000);

httpServer.listen(port, () => logger.info(`Listening on port ${port}`));
