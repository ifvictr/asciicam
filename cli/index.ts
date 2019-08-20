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
program
    .command("create [passphrase]")
    .action((passphrase: string) => {
        console.log(`Room created! Your room ID is <roomId> and the passphrase is ${passphrase}`)
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
            webcam.capture("test_picture", (err: any, data: any) => {
                if (err) {
                    // Do stuff
                }
                imageToAscii(data, (err: any, convertedImage: any) => {
                    console.log(convertedImage)
                })
            })
        }, 500)

        // Start camera and converting to ASCII, then sending to peers
    })
program
    .command("join <roomId>")
    .action((roomId: string) => {
        // Send roomId to main server to see if it exists
        console.log("You’ve joined the room: " + roomId)
    })

program.parse(process.argv)