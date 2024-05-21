import fs from "fs";
import chalk from "chalk";

interface LoggerSettings {
    type?: string;
    emoji?: string;
    message: string;
    color?: string;
    file?: string;
    object?: any;
}

interface LoggerSettingsUser {
    message: string;
    file?: string;
    object?: any;
}

const printlog = (settings: LoggerSettings) => {
    try {
        const { color, emoji, message, file, object } = settings;
        const date = new Date().toLocaleString();

        let output = "";
        output += `${chalk.gray("[")}${chalk.hex(color || "")(date)}${chalk.gray("] ")}${emoji} ${message}`;

        if (file) {
            return fs.appendFileSync(file, `[${date}] ${emoji} ${message}` + "\n");
        }

        console.log(output, object ? '\n' + object : "");
    } catch (err) {
        console.log("Error in printlog: ", err);
    }
};

const createLoggerMethod = (type: string, emoji: string, color: string) => {
    return (settings: LoggerSettingsUser) => {
        printlog({
            type,
            emoji,
            color,
            message: settings.message,
            file: settings.file,
            object: settings.object,
        });
    };
};

const logger = {
    clear: () => console.clear(),
    success: createLoggerMethod("success", "✅", "#84cc16"),
    error: createLoggerMethod("error", "❌", "#ef4444"),
    warn: createLoggerMethod("warning", "⚠️ ", "#fbbf24"),
    info: createLoggerMethod("info", "ℹ️ ", "#0ea5e9"),
    log: createLoggerMethod("log", "  ", "#ffffff"),
};

export default logger;
