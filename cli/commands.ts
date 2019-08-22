var program = require('commander');
// import imageToAscii from "image-to-ascii"
const imageToAscii = require('image-to-ascii')
// import NodeWebcam from "node-webcam"
const NodeWebcam = require('node-webcam')
const computeSize = require('compute-size')

program
	.command('create [passphrase]')
	.alias("c")
    .description("")
	.action(function(passphrase: string){
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
        }
        const webcam = NodeWebcam.create(camOpts)
        setInterval(() => {
            webcam.capture("test", (err: any, data: any) => {
                imageToAscii(data, imgOpts, (err: any, convertedImage: any) => {
                    // TODO: Optimize for realtime render
                    // console.log(convertedImage + "\r\x1B[50A")
                    console.log("\n\n" + convertedImage + "\x1B[0;0H")
                    //console.log(computeSize(options.size))
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