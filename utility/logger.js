const { createLogger, format, transports } = require('winston'); // Destruct the required methods from winston
const { combine, timestamp, printf, colorize } = format; // Destruct the required methods from format

const levels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly']; // Define the log levels
const arguments =  process.argv // Get arguments used when starting the script

let log_level; // The level of logs to display

// If there is a -L parameter change the log level
if (arguments.includes('-l')) {
  let index = arguments.indexOf('-l'); // Get the index of the -l operator
  log_level = parseInt(arguments[index + 1]); // Set the level to the one specified
}

// Export the logger to send output to
module.exports = createLogger({
  level: levels[log_level || 2],
  format: combine(
    colorize({ level: true }),
    timestamp(),
    printf(({level, message, timestamp}) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [
    new transports.Console()
  ]
});