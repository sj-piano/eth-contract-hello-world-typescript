// Imports
import Joi from "joi";
import winston from "winston";
const { combine, timestamp, printf, colorize, align, json } = winston.format;

// Local imports
import { config } from "#root/config";

// Classes

class Logger {
  logger: winston.Logger;

  constructor( { logLevel }: {logLevel?: string} = {logLevel: 'error'}) {
    this.logger = winston.createLogger({
      level: logLevel,
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

  }

  setLevel({ logLevel } : { logLevel: string }) {
    const logLevelSchema = Joi.string().valid(...config.logLevelList);
    let logLevelResult = logLevelSchema.validate(logLevel);
    if (logLevelResult.error) {
      let msg = `Invalid log level "${logLevel}". Valid options are: [${config.logLevelList.join(
        ", "
      )}]`;
      throw new Error(msg);
    }
    this.logger.transports.forEach((t) => (t.level = logLevel));
    this.logger.level = logLevel;
  };

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

function createLogger({logLevel}: {logLevel: string} = { logLevel: 'error'}) {
  const logger = new Logger({ logLevel });
  const log = logger.log.bind(logger);
  const deb = logger.deb.bind(logger);
  return { logger, log, deb };
}

// Exports

export {
  Logger,
  createLogger,
}
