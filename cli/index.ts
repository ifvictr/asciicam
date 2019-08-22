import program from 'commander'
import imageToAscii from 'image-to-ascii'
import NodeWebcam from 'node-webcam'
import Peer from 'simple-peer'
import SimpleSignalClient from 'simple-signal-client'
import io from 'socket.io-client'
import wrtc from 'wrtc'

const SIGNAL_URL: string = 'http://localhost:8080'

program
    .command('create [passphrase]')
    .alias('c')
    .description('Create a new chat room, optionally locked with the specified passphrase')
    .action((passphrase: string) => {
        // 1. Start basic socket for signaling and basic data
        const socket = io(SIGNAL_URL)
        const signalClient = new SimpleSignalClient(socket)
        socket.on('room_create_callback', (roomId: string) => {
            console.log(`room created! your room ID is ${roomId} and the passphrase is ${passphrase}`)
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

        signalClient.on('discover', async (peerIds: string[]) => {
            console.log('peerIds: ', peerIds)
            // TODO: Get ID to connect to
            const id = peerIds[0]
            console.log('my id: ', socket.id)
            console.log('create id: ', id)
            try {
                const { peer } = await signalClient.connect(id, null, { wrtc })
                console.log('initiator peer: ', peer)
            } catch (e) {
                console.log('error: ', e)
            }
        })

        signalClient.on('request', async (request: any) => {
            try {
                const { peer } = await request.accept(null, { wrtc })
                console.log('non-initiator peer: ', peer)
            } catch (e) {
                console.log('error: ', e)
            }
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
            return
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
        const socket = io(SIGNAL_URL)
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
            signalClient.discover(roomId)
        })

        signalClient.on('discover', async (peerIds: string[]) => {
            console.log('peerIds: ', peerIds)
            // TODO: Get ID to connect to
            const id = peerIds[0]
            console.log('my id: ', socket.id)
            console.log('join id: ', id)
            try {
                const { peer } = await signalClient.connect(id, null, { wrtc })
                console.log('initiator peer: ', peer)
            } catch (e) {
                console.log('error: ', e)
            }
        })

        signalClient.on('request', async (request: any) => {
            try {
                const { peer } = await request.accept(null, { wrtc })
                console.log('non-initiator peer: ', peer)
            } catch (e) {
                console.log('error: ', e)
            }
        })
    })

program.parse(process.argv)

export default program