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

program
    .command('create [passphrase]', '')
    .command('join <roomId>', '')

const opts: any = {
    width: 1280,
    height: 720,
    quality: 100,
    delay: 0,
    // Save shots in memory
    saveShots: false,
    // [jpeg, png] support varies
    output: "jpeg",
    device: false,
    // [location, buffer, base64]
    callbackReturn: "buffer",
    verbose: false
}
const webcam = NodeWebcam.create(opts)
setInterval(() => {
    webcam.capture("test", (err: any, data: any) => {
        imageToAscii(data, (err: any, convertedImage: any) => {
            // TODO: Optimize for realtime render
            console.log(convertedImage)
        })
    })
}, 500)
program.parse(process.argv)