"use strict";
exports.__esModule = true;
var commander_1 = require("commander");
var package_json_1 = require("./package.json");
commander_1["default"]
    .version(package_json_1["default"].version)
    .description(package_json_1["default"].description);
// Sub-commands
commander_1["default"]
    .command("create [passphrase]")
    .action(function (passphrase) {
    console.log("Room created! Your room ID is <roomId> and the passphrase is " + passphrase);
    // Start camera and converting to ASCII, then sending to peers
});
commander_1["default"]
    .command("join <roomId>")
    .action(function (roomId) {
    console.log("You’ve joined the room: " + roomId);
});
commander_1["default"].parse(process.argv);
