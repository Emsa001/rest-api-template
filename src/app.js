require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const requestLogger = require("morgan");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const logger = require("./utils/consoleLog");

const config = require("./configs/config.json");
const sequelize = require("./database/connection");

const app = express();

const limiter = rateLimit({
    windowMs: config.limits.clearTime_IN_SECONDS, // time in seconds
    max: config.limits.maxRequests,
});

app.use(requestLogger("dev"));
app.use(cors());

app.use(bodyParser.json({ limit: "1mb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(limiter);
console.clear();

const routesPath = path.join(__dirname, "routes");
logger.title({
    type: "info",
    text: "Loading Routes",
    length: 40,
})
fs.readdirSync(routesPath).forEach((file) => {
    if (file.endsWith(".js")) {
        const route = require(path.join(routesPath, file));
        let listening = "/" + path.parse(file).name;
        app.use(listening, route);
        logger.success({
            title:"Route",
            message: `📁 Route ${file} listening on ${listening}`,
        });
    }
    console.log("");
});


const modelsPath = path.join(__dirname, "database", "models");

const models = fs.readdirSync(modelsPath)
    .filter(file => file.endsWith(".js"))
    .map(file => require(path.join(modelsPath, file)));

(async () => {
    await sequelize
        .sync({ force: false })
        .then(() => {
            logger.success({
                title:"Database",
                message: "Database synchronized.",
                showDate:true,
            });
            const tableNames = Object.keys(sequelize.models);
            tableNames.forEach((tableName) => {
                logger.info({
                    title:"Database",
                    showDate:true,
                    message: `Table ${tableName} synchronized.`,
                });
            });
        })
        .catch((error) => {
            logger.error({
                title:"Database",
                message: "Error synchronizing the database",
                json: error,
            })
        });
})();

module.exports = app;
