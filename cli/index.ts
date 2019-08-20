import program from "commander"
// import imageToAscii from "image-to-ascii"
const imageToAscii = require('image-to-ascii')
// import NodeWebcam from "node-webcam"
const NodeWebcam = require('node-webcam')
import pkg from "./package.json"

program
    .version(pkg.version)
    .description(pkg.description)

// Sub-commands
import('./commands/create').then(command => command.default(program))
import('./commands/join').then(command => command.default(program))

program.parse(process.argv)