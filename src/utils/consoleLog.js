const chalk = require("chalk");
const dateFormat = require("dateformat");
const fs = require("fs");
const path = require("path");
const config = require("../configs/config.json");

const colors = {
    success: "green",
    error: "red",
    warning: "yellow",
    log: "blue",
    info: "cyan",
};

function getTime() {
    const now = new Date();
    return dateFormat(now, "yyyy-mm-dd hh:MM:ss");
}

const save_log = (type, title, message, json) => {
    const logDirectory = "./logs";
    const logFileName = `${type}.log`;
    const logFilePath = path.join(logDirectory, logFileName);

    const logEntry = {
        date: new Date().toJSON(),
        title: title,
        message: message,
        json: json?.toString() || "",
    };

    fs.mkdir(logDirectory, { recursive: true }, (err) => {
        if (err) {
            console.error(`Error creating log directory: ${err}`);
        } else {
            fs.appendFile(logFilePath, JSON.stringify(logEntry) + "\n", (err) => {
                if (err) {
                    console.error(`Error writing to ${logFileName}: ${err}`);
                }
            });
        }
    });
};

const logMessage = (settings) => {
    const { type, title, message, showDate, separator, json } = settings;
    if (separator) {
        logComponent.title(type, title, message.length + 2);
        console.log(chalk.dim(" " + message));
        logComponent.separator(message.length + 2);
    } else {
        let time = ">";
        if(showDate){
            time = chalk.gray(`[ ${getTime()} ]`);
        }
        console.log(chalk[colors[type]](title), time, chalk[colors[type]](message));
    }
    if (config.logs.save[type]) {
        save_log(type, title, message, json);
    }
};

const logComponent = {
    success: (settings) => {
        logMessage({ type: "success", ...settings });
    },
    error: (settings) => {
        logMessage({ type: "error", ...settings });
    },
    warning: (settings) => {
        logMessage({ type: "warning", ...settings });
    },
    log: (settings) => {
        logMessage({ type: "log", ...settings });
    },
    info: (settings) => {
        logMessage({ type: "info", ...settings });
    },
    multiLine: (messageArray) => {
        messageArray.forEach((message) => {
            logMessage("log", message);
        });
    },
    separator: (settings) => {
        const { length } = settings;
        const sep = "=".repeat(length);
        console.log(chalk.cyan(sep));
    },
    title: (settings) => {
        const { type, text, length } = settings;
        if (text.length >= length) {
            return text;
        }

        const paddingLength = length - text.length - 4;
        const leftPadding = "=".repeat(Math.floor(paddingLength / 2));
        const rightPadding = "=".repeat(Math.ceil(paddingLength / 2));

        console.log(chalk.cyan(leftPadding + "[ ") + chalk[colors[type]](text) + chalk.cyan(" ]" + rightPadding));
    },
};

module.exports = logComponent;
