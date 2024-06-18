import fs from "fs";
import chalk from "chalk";
import path from "path";
import { fileURLToPath } from "url";

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

class Logger {
    private static instance: Logger;
    private logDirectory: string;

    private constructor() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        this.logDirectory = path.join(__dirname, "../../logs"); // Adjust path to the root directory
        this.ensureLogDirectory();
    }

    private ensureLogDirectory() {
        if (!fs.existsSync(this.logDirectory)) {
            fs.mkdirSync(this.logDirectory, { recursive: true });
        }
    }

    private saveLog(output: string, file: string) {
        try {
            const filePath = path.join(this.logDirectory, file);
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, "", { flag: "wx" });
            }
            fs.appendFileSync(filePath, output + "\n");
        } catch (err) {
            console.log("Error in saveLog: ", err);
        }
    }

    private printLog(settings: LoggerSettings) {
        try {
            const { color, emoji, message, object, file, type } = settings;
            const date = new Date().toLocaleString();
            const output = `${chalk.gray("[")}${chalk.hex(color || "#ffffff")(date)}${chalk.gray("] ")}${emoji} ${message}`;

            let logFile = file;

            if (type === "error" && !file) logFile = process.env.SYS_ERRORS_LOGS_FILE || "sys_errors.log";

            if (logFile) this.saveLog(`[${date}] ${emoji} ${message}\n${JSON.stringify(object)}`, logFile);

            console.log(output);
            if (object) console.log(chalk.red("Error: "), object);
        } catch (err) {
            console.log("Error in printLog: ", err);
        }
    }

    private createLoggerMethod(type: string, emoji: string, color: string) {
        return (settings: LoggerSettingsUser) => {
            this.printLog({
                type,
                emoji,
                color,
                message: settings.message,
                file: settings.file,
                object: settings.object,
            });
        };
    }

    public clear() {
        console.clear();
    }

    public success = this.createLoggerMethod("success", "✅", "#84cc16");
    public error = this.createLoggerMethod("error", "❌", "#ef4444");
    public warn = this.createLoggerMethod("warning", "⚠️ ", "#fbbf24");
    public info = this.createLoggerMethod("info", "ℹ️ ", "#0ea5e9");
    public log = this.createLoggerMethod("log", "  ", "#ffffff");

    public static getInstance(): Logger {
        if (!Logger.instance) Logger.instance = new Logger();
        return Logger.instance;
    }
}

const logger = Logger.getInstance();
export default logger;
