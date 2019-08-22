var program = require('commander');
// import imageToAscii from "image-to-ascii"
const imageToAscii = require('image-to-ascii')
// import NodeWebcam from "node-webcam"
const NodeWebcam = require('node-webcam')
var Microphone = require('node-microphone')
var wav = require('wav')
var fs = require('fs')

program
    .command('create [passphrase]')
    .alias("c")
    .description("")
    .action(function (passphrase: string) {
        console.log(`Room created! Your room ID is <roomId> and the passphrase is ${passphrase}`);

		// Start camera
        const camOpts: any = {
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
        const imgOpts: any = {
            pixels: ".,:;i1tfLHACK08@",
            colored: false,
            fg: false
        }
        const webcam = NodeWebcam.create(camOpts)
        const mic = new Microphone()
        const buff:Array<number> = []

        setInterval(() => {
            webcam.capture("test", (err: any, data: any) => {
                imageToAscii(data, imgOpts, (err: any, convertedImage: any) => {
                    // TODO: Optimize for realtime render
                    // console.log(convertedImage + "\r\x1B[50A")
                    console.log( convertedImage + "\x1B[0;0H")
                })
            })
        }, 500)
        //console.log("\x1B[60B")

        let micStream = mic.startRecording();
        //saving to a local .wav file for now, we can sort actual wrtie stream later
        micStream.pipe( fs.createWriteStream('./testaudio.wav') );
        setTimeout(() => {
            console.log('stopped recording audio');
            mic.stopRecording();
        }, 10000);
        
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