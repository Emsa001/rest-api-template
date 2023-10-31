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

const logMessage = (type, title, message, separator, json) => {
    if (separator) {
        logComponent.title(type, title, message.length + 2);
        console.log(chalk.dim(" " + message));
        logComponent.separator(message.length + 2);
    } else {
        console.log(chalk[colors[type]](title), chalk.gray(`[ ${getTime()} ]`), message);
    }
    if (config.logs.save[type]) {
        save_log(type, title, message, json);
    }
};

const logComponent = {
    success: (title, message, separator, json) => {
        logMessage("success", title, message, separator, json);
    },
    error: (title, message, separator, json) => {
        logMessage("error", title, message, separator, json);
    },
    warning: (title, message, separator, json) => {
        logMessage("warning", title, message, separator, json);
    },
    log: (title, message, separator) => {
        logMessage("log", title, message, separator, json);
    },
    info: (title, message, separator, json) => {
        logMessage("info", title, message, separator, json);
    },
    multiLine: (messageArray) => {
        messageArray.forEach((message) => {
            logMessage("log", message);
        });
    },
    header: (message) => {
        logComponent.separator(30);
        logComponent.success("   [ MineReality WebAPI ]\n");
        logComponent.info(`   Author: Emanuel Scura`);
        logComponent.separator(30);
        console.log("\n");
    },
    separator: (length) => {
        const sep = "=".repeat(length);
        console.log(chalk.cyan(sep));
    },
    title: (type, text, length) => {
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
