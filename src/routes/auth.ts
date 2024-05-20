import express from "express";
import validate from "@/utils/validation";
import schemas from "@/utils/schemas";

import authController from "@/controllers/auth";

const router = express.Router();

router.post("/reigster", validate(schemas.register), authController.register);
router.post("/login", validate(schemas.login), authController.login);

router.all("*", (req, res) => {
    res.status(400).json({ message: "Bad Request." });
});

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

module.exports = router;

