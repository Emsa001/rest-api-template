const logger = require("../utils/consoleLog");

exports.helloWorld = async (req, res) => {
    try {
        return res.json({ message: "Hello World" });
    } catch (error) {
        logger.error("HelloWorld", "Error handling helloWorld", false, error);
    }
};
