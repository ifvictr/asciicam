import program from 'commander'
import imageToAscii from 'image-to-ascii'
import NodeWebcam from 'node-webcam'
import Peer from 'simple-peer'
import SimpleSignalClient from 'simple-signal-client'
import io from 'socket.io-client'
import terminalImage from 'terminal-image'
import wrtc from 'wrtc'

const SIGNAL_URL: string = 'http://localhost:8080'

program
    .command('create [passphrase]')
    .alias('c')
    .option('-s, --server <address>', '')
    .description('Create a new chat room, optionally locked with the specified passphrase')
    .action(commandCreateRoom)


program
    .command('join <roomId> [passphrase]')
    .alias('j')
    .option('-s, --server <address>', '')
    .description('Join the specified chat room')
    .action(commandJoinRoom)

program.parse(process.argv)

/**
 * Starts the signalling server, listens for connections.
 */
function commandCreateRoom(passphrase: string, opts: any) {
    // 1. Start basic socket for signaling and basic data
    const socket = io(opts.server || SIGNAL_URL)
    const signalClient = new SimpleSignalClient(socket)
    let storedRoomId
    socket.on('room_create_callback', (roomId: string) => {
        console.log(`room created! your room ID is ${roomId} and the passphrase is ${passphrase}`)
        // 2. Join created room
        // We know the room exists, now add them
        storedRoomId = roomId
        socket.emit('room_join', { roomId, passphrase: passphrase || '' })
    })

    // 2. Send request to create room
    socket.emit('room_create', passphrase)

    socket.on('disconnect', () => {
        console.log('you’ve been disconnected')
        process.exit(0)
    })

    socket.on('error', (...args) => {
        console.log('an error occurred :(')
        console.log(args)
    })

    socket.on('room_video_update', image => {
        console.log(image + '\x1B[0;0H')
    })

    signalClient.on('discover', async (peerIds: string[]) => {
        console.log('peerIds: ', peerIds)
        // TODO: Get ID to connect to
        const id = peerIds[0]
        console.log('signalClient id: ', signalClient.id)
        console.log('my id: ', socket.id)
        console.log('create id: ', id)
        try {
            console.log('attempt to connect')
            const { peer } = await signalClient.connect(id, null, { wrtc })
            console.log('initiator peer: ', peer)
        } catch (e) {
            console.log('error: ', e)
        }
    })

    signalClient.on('request', async (request: any) => {
        try {
            console.log('attempt to accept')
            const { peer } = await request.accept(null, { wrtc })
            console.log('non-initiator peer: ', peer)
        } catch (e) {
            console.log('error: ', e)
        }
    })

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
            // TODO: Check quality flag
            // Basic quality
            imageToAscii(data, imgOpts, (err: any, convertedImage: any) => {
                // TODO: Optimize for realtime render
                console.log('storedRoomId: ', storedRoomId)
                socket.emit('room_video_update', { roomId: storedRoomId, data: convertedImage })
                // console.log(convertedImage + '\x1B[0;0H')
            })

            // High quality
            // terminalImage.buffer(data).then((convertedImage: any) => {
            //     console.log(convertedImage + '\x1B[0;0H')
            // })
        })
    }, 250)
}

function commandJoinRoom(roomId: string, passphrase: string, opts: any) {
    // 1. Emit roomId to main server to see if it exists
    console.log(opts.server)
    const socket = io(opts.server || SIGNAL_URL)
    const signalClient = new SimpleSignalClient(socket)
    socket.emit('room_join', { roomId, passphrase: passphrase || '' })
    socket.on('disconnect', () => {
        console.log('you’ve been disconnected')
        process.exit(0)
    })
    socket.on('room_join_callback', (status: string) => {
        // 2. If the attempt fails, notify and exit
        const statusMessage = ({
            success: `you’ve joined the room: ${roomId}`,
            failed: 'incorrect passphrase',
            not_found: 'room not found'
        })[status] || 'unknown status received'
        console.log(statusMessage)

        if (status !== 'success') {
            socket.disconnect()
        }

        // Start sending/receiving data
        // signalClient.discover(roomId)
    })

    socket.on('room_video_update', image => {
        console.log(image + '\x1B[0;0H')
    })

    signalClient.on('discover', async (peerIds: string[]) => {
        console.log('peerIds: ', peerIds)
        // TODO: Get ID to connect to
        const id = peerIds[0]
        console.log('signalClient id: ', signalClient.id)
        console.log('my id: ', socket.id)
        console.log('join id: ', id)
        try {
            console.log('attempt to connect')
            const { peer } = await signalClient.connect(id, null, { wrtc })
            console.log('initiator peer: ', peer)
        } catch (e) {
            console.log('error: ', e)
        }
    })

    signalClient.on('request', async (request: any) => {
        try {
            console.log('attempt to accept')
            const { peer } = await request.accept(null, { wrtc })
            console.log('non-initiator peer: ', peer)
        } catch (e) {
            console.log('error: ', e)
        }
    })

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
        webcam.capture('test1', (err: any, data: any) => {
            // TODO: Check quality flag
            // Basic quality
            imageToAscii(data, imgOpts, (err: any, convertedImage: any) => {
                // TODO: Optimize for realtime render
                console.log('roomId: ', roomId)
                socket.emit('room_video_update', { roomId, data: convertedImage })
                // console.log(convertedImage + '\x1B[0;0H')
            })

            // High quality
            // terminalImage.buffer(data).then((convertedImage: any) => {
            //     console.log(convertedImage + '\x1B[0;0H')
            // })
        })
    }, 250)
}