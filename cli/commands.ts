var program = require('commander');
// import imageToAscii from "image-to-ascii"
const imageToAscii = require('image-to-ascii')
// import NodeWebcam from "node-webcam"
const NodeWebcam = require('node-webcam')

program
    .command('create [passphrase]')
    .alias("c")
    .description("")
    .action(function (passphrase: string) {
        console.log(`Room created! Your room ID is <roomId> and the passphrase is ${passphrase}`);

        // Start camera
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

    });

program
    .command("join <roomId>", { isDefault: true })
    .alias("j")
    .description("")
    .action((roomId: string) => {
        // Send roomId to main server to see if it exists

        // If it doesn't, notify the user and exit
        // If it does, attempt to establish a connection to the server

        // If the attempt fails, notify and exit
        // If succeeds, connect and start streaming data
        console.log("You’ve joined the room: " + roomId)
    })

program.parse(process.argv);

export default program;