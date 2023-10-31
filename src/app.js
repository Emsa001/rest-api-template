require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const requestLogger = require("morgan");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const logger = require("./utils/consoleLog");

const config = require("./configs/config.json");
const sequelize = require("./database/connection");

const indexRouter = require("./routes/index");
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
app.use("/", indexRouter);

console.clear();
(async () => {
    await sequelize
        .sync({ force: false })
        .then(() => {
            logger.success("Database", "Database and tables created successfully.", false);
        })
        .catch((error) => {
            logger.error("Database", "Error synchronizing the database", false, error);
        });
})();

module.exports = app;
