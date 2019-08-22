import program from 'commander'
import imageToAscii from 'image-to-ascii'
import NodeWebcam from 'node-webcam'
import Peer from 'simple-peer'
import SimpleSignalClient from 'simple-signal-client'
import io from 'socket.io-client'
import wrtc from 'wrtc'

program
    .command('create [passphrase]')
    .alias('c')
    .description('Create a new chat room, optionally locked with the specified passphrase')
    .action((passphrase: string) => {
        console.log(`Room created! Your room ID is <roomId> and the passphrase is ${passphrase}`)

        // 1. Start basic socket for signaling and basic data
        // TODO: Change IP
        const socket = io('http://localhost:8080')
        const signalClient = new SimpleSignalClient(socket)
        socket.on('disconnect', () => {
            console.log('just got disconnected bitch')
            process.exit(0)
        })

        socket.on('error', (...args) => {
            console.log('an error occurred')
            console.log(args)
        })

        signalClient.on('discover', async (...args) => {
            console.log(args)
            // TODO: Get ID to connect to
            const id = 'something'
            const { peer } = await signalClient.connect(id)
            console.log('initiator peer: ', peer)
        })

        signalClient.on('request', async (request: any) => {
            const { peer } = await request.accept()
            console.log('non-initiator peer: ', peer)
        })
        // 2. Send request to create room
        socket.emit('room_create', passphrase)
        socket.on('room_create_callback', (roomId: string) => {
            console.log('roomId: ' + roomId)
        })
        // 2. Join created room

        // 3. Start mic and send audio data

        // 4. Start camera and send video data
        const camOpts: any = {
            width: 1280,
            height: 720,
            quality: 100,
            delay: 0,
            saveShots: false,
            output: 'jpeg',
            device: false,
            callbackReturn: 'buffer',
            verbose: false
        }
        const imgOpts: any = {
            pixels: '.,:;i1tfLHACKLODGE08@',
            // colored: false
        }
        const webcam = NodeWebcam.create(camOpts)
        setInterval(() => {
            webcam.capture('test', (err: any, data: any) => {
                imageToAscii(data, imgOpts, (err: any, convertedImage: any) => {
                    // TODO: Optimize for realtime render
                    // socket.emit('message', convertedImage)
                    console.log(convertedImage + '\x1B[0;0H')
                })
            })
        }, 1000)
    })


program
    .command('join <roomId> [passphrase]')
    .alias('j')
    .description('Join the specified chat room')
    .action((roomId: string, passphrase: string) => {
        // 1. Emit roomId to main server to see if it exists
        const socket = io('http://localhost:8080')
        socket.emit('room_join', { roomId, passphrase })
        socket.on('room_join_callback', (status: string) => {
            // Statuses: not_found, success, failed
            console.log('status: ' + status)
            switch (status) {
                case 'success':
                    break
                case 'failed':
                    break
                case 'not_found':
                    break
                default:
                    break
            }
            if (status) {
                // If it doesn't, notify the user and exit
            } else {
                // If it does, attempt to establish a connection to the server
            }
        })

        // 2. If the attempt fails, notify and exit
        // If succeeds, connect and start streaming data
        console.log(`You’ve joined the room: ${roomId}`)
    })

program.parse(process.argv)

export default program