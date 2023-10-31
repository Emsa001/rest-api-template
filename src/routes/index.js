const express = require("express");
const router = express.Router();
const validate = require("../utils/validator");

const exampleController = require("../controllers/example");
const systemController = require("../controllers/system");

router.get("/status", validate(), systemController.status);
router.get("/hello", validate(), exampleController.helloWorld);

router.all("*", (req, res) => {
    res.status(400).json({ message: "Bad Request." });
});

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

module.exports = router;
