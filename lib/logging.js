// Imports
const Joi = require("joi");
const winston = require("winston");
const { combine, timestamp, printf, colorize, align, json } = winston.format;

// Local imports
const { config } = require("#root/config.js");

// Functions

function createLogger({ level = "error" } = {}) {
  const logger = winston.createLogger({
    level,
    //format: winston.format.cli(),
    //format: winston.format.json(),
    format: combine(
      colorize({ all: true }),
      timestamp({
        format: "YYYY-MM-DD HH:mm:ss.SSS",
      }),
      align(),
      printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [new winston.transports.Console()],
  });
  logger.setLevel = ({ logLevel }) => {
    const logLevelSchema = Joi.string().valid(...config.logLevelList);
    let logLevelResult = logLevelSchema.validate(logLevel);
    if (logLevelResult.error) {
      let msg = `Invalid log level "${logLevel}". Valid options are: [${config.logLevelList.join(
        ", "
      )}]`;
      throw new Error(msg);
    }
    logger.transports.forEach((t) => (t.level = logLevel));
    logger.level = logLevel;
  };
  const log = logger.info;
  const deb = logger.debug;
  logger.log = log;
  logger.deb = deb;
  return { logger, log, deb };
}

function validateLogger({ logger }) {
  if (!logger) {
    throw new Error(`logger is required`);
  }
  if (!logger.log) {
    throw new Error(`logger.log is required`);
  }
  if (!logger.deb) {
    throw new Error(`logger.deb is required`);
  }
  if (!logger.error) {
    throw new Error(`logger.error is required`);
  }
  return logger;
}

module.exports = { createLogger, validateLogger };
