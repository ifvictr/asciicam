"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = __importDefault(require("commander"));
// import imageToAscii from "image-to-ascii"
var imageToAscii = require('image-to-ascii');
// import NodeWebcam from "node-webcam"
var NodeWebcam = require('node-webcam');
var package_json_1 = __importDefault(require("./package.json"));
commander_1.default
    .version(package_json_1.default.version)
    .description(package_json_1.default.description);
prompt('commands').then(function (command) { return command.default(commander_1.default); });
// Sub-commands
//import('./commands/create').then(command => command.default(program))
//import('./commands/join').then(command => command.default(program))
commander_1.default.parse(process.argv);
