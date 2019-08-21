"use strict";
var program = require('commander');
// import imageToAscii from "image-to-ascii"
var imageToAscii = require('image-to-ascii');
// import NodeWebcam from "node-webcam"
var NodeWebcam = require('node-webcam');
program
    .command('create [passphrase]')
    .alias("c")
    .description("")
    .action(function (passphrase) {
    console.log("Room created! Your room ID is <roomId> and the passphrase is " + passphrase);
    // // Start camera
    // const opts: any = {
    //     width: 1280,
    //     height: 720,
    //     quality: 100,
    //     delay: 0,
    //     // Save shots in memory
    //     saveShots: false,
    //     // [jpeg, png] support varies
    //     output: "jpeg",
    //     device: false,
    //     // [location, buffer, base64]
    //     callbackReturn: "buffer",
    //     verbose: false
    // }
    // const webcam = NodeWebcam.create(opts)
    // setInterval(() => {
    //     webcam.capture("test", (err: any, data: any) => {
    //         imageToAscii(data, (err: any, convertedImage: any) => {
    //             // TODO: Optimize for realtime render
    //             console.log(convertedImage)
    //         })
    //     })
    // }, 500)
});
program.parse(process.argv);
