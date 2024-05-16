import pino from "pino";

const mainLogger = pino({
  level: Bun.env.LOG_LEVEL || "info",
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default mainLogger;
