import imageToAscii from 'image-to-ascii'
import NodeWebcam from 'node-webcam'
import SimpleSignalClient from 'simple-signal-client'
import io from 'socket.io-client'
import wrtc from 'wrtc'

const SIGNAL_URL: string = 'http://localhost:8080'

export default (roomId: string, passphrase: string, opts: any) => {
    // 1. Emit roomId to main server to see if it exists
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
                // console.log('roomId: ', roomId)
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