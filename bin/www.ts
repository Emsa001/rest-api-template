import "dotenv/config";

import http from "http";
import https from "https";
import fs from "fs";

import app from "@/index";
import logger from "@/utils/logger";

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || "3000");

// Function to create an HTTPS server.
function createHttpsServer() {
    try {
        const keyPath = process.env.HTTPS_KEY_PATH || "../certs/private.key";
        const certPath = process.env.HTTPS_CERT_PATH || "../certs/certificate.crt";

        const privateKey = fs.readFileSync(keyPath, "utf8");
        const certificate = fs.readFileSync(certPath, "utf8");
        const credentials = { key: privateKey, cert: certificate };

        return https.createServer(credentials, app);
    } catch (err) {
        logger.error({ message: "Failed to read HTTPS certificate or key files", object: err });
        process.exit(1);
    }
}

// Create HTTP or HTTPS server based on environment variable.
const server = process.env.HTTPS === "true" ? createHttpsServer() : http.createServer(app);

// Listen on provided port, on all network interfaces.
app.set("port", port);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

// Function to normalize a port into a number, string, or false.
function normalizePort(val: string) {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val; // named pipe
    if (port >= 0) return port; // port number
    return false;
}

// Event listener for HTTP server "error" event.
function onError(error: any) {
    if (error.syscall !== "listen") throw error;

    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

    // Handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            logger.error({ message: `${bind} requires elevated privileges` });
            process.exit(1);
            break;
        case "EADDRINUSE":
            logger.error({ message: `${bind} is already in use` });
            process.exit(1);
            break;
        default:
            throw error;
    }
}

// Event listener for HTTP server "listening" event.
function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`;

    logger.info({ message: `Listening on ${bind}` });
}

// Catch unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    logger.error({ message: "Unhandled Rejection at:", object: promise });
    process.exit(1);
});

// Catch uncaught exceptions
process.on("uncaughtException", (err) => {
    logger.error({ message: "Uncaught Exception thrown", object: err });
    process.exit(1);
});
