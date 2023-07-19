// Imports
import Joi from "joi";
import winston from "winston";
const { combine, printf, colorize, align, json } = winston.format;

// Local imports
import { config } from "#root/config";

// Classes

class Logger {
  logger: winston.Logger;

  constructor(
    {
      fileName,
      logLevel,
      logTimestamp,
    }: { fileName?: string; logLevel?: string; logTimestamp?: boolean } = {
      fileName: "",
      logLevel: "error",
      logTimestamp: false,
    },
  ) {
    if (fileName) {
      fileName = fileName.replace(process.cwd() + "/", "");
    }
    // Build log format.
    const logFormat = (info: any) => {
      let { level, message, timestamp } = info;
      let s = `${level}: ${message}`;
      if (fileName) {
        s = `${fileName}: ` + s;
      }
      if (logTimestamp) {
        s = `${timestamp} ` + s;
      }
      return s;
    };
    this.logger = winston.createLogger({
      level: logLevel,
      //format: winston.format.cli(),
      //format: winston.format.json(),
      format: combine(
        colorize({ all: true }),
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss.SSS",
        }),
        align(),
        printf(logFormat),
      ),
      transports: [new winston.transports.Console()],
    });
  }

  setLevel({ logLevel }: { logLevel: string }) {
    const logLevelSchema = Joi.string().valid(...config.logLevelList);
    let logLevelResult = logLevelSchema.validate(logLevel);
    if (logLevelResult.error) {
      let msg = `Invalid log level "${logLevel}". Valid options are: [${config.logLevelList.join(
        ", ",
      )}]`;
      throw new Error(msg);
    }
    this.logger.transports.forEach((t) => (t.level = logLevel));
    this.logger.level = logLevel;
  }

  deb(...args: any[]) {
    let arg = args.length == 1 ? args[0] : args;
    this.debug(arg);
  }

  log(...args: any[]) {
    let arg = args.length == 1 ? args[0] : args;
    this.info(arg);
  }

  debug(...args: any[]) {
    let arg = args.length == 1 ? args[0] : args;
    this.logger.debug(arg);
  }

  info(...args: any[]) {
    let arg = args.length == 1 ? args[0] : args;
    this.logger.info(arg);
  }

  warn(...args: any[]) {
    let arg = args.length == 1 ? args[0] : args;
    this.logger.warn(arg);
  }

  error(...args: any[]) {
    let arg = args.length == 1 ? args[0] : args;
    this.logger.error(arg);
  }
}

// Functions

function createLogger({
  fileName,
  logLevel,
  logTimestamp,
}: { fileName?: string; logLevel?: string; logTimestamp?: boolean } = {}) {
  const logger = new Logger({ fileName, logLevel, logTimestamp });
  const log = logger.log.bind(logger);
  const deb = logger.deb.bind(logger);
  return { logger, log, deb };
}

// Exports

export { Logger, createLogger };
