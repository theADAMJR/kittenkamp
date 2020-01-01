const express = require("express");

let router = express.Router();

router.get("/", (req, res) => res.render("home"));

module.exports = router;

// only having 1 root defined is unnecessary,
// but this file can be used for defining more routes