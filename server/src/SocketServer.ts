import randomatic from 'randomatic'
import SimpleSignalServer from 'simple-signal-server'
import io from 'socket.io'
import { SocketEvent } from './constants'
import { Room } from './types'

export default class SocketServer {
    static readonly PORT: number = 8080
    private _server: io.Server
    private signalServer: any
    private port: string | number
    private rooms: Map<string, Room>

    constructor() {
        this.port = process.env.PORT || SocketServer.PORT
        this._server = io()
        this.signalServer = new SimpleSignalServer(this._server)
        this.rooms = new Map()
    }

    listen(): void {
        this.server.listen(this.port)
        console.log(`[server](message): listening on port ${this.port}`)

        this.server.on(SocketEvent.CONNECT, (socket: any) => {
            console.log(`[socket ${socket.id}]: connected`)

            socket.on(SocketEvent.MESSAGE, (message: any) => {
                console.log(`[server]: (message) ${JSON.stringify(message)}`)
                this.server.emit('message', message)
            })

            socket.on(SocketEvent.ROOM_CREATE, (passphrase: string) => {
                const roomId: string = randomatic('A0', 8)
                this.rooms.set(roomId, { passphrase })
                socket.join(roomId)
                socket.emit(SocketEvent.ROOM_CREATE_CALLBACK, roomId)
                console.log(`[server]: room created, id: ${roomId}`)
                console.log(this.rooms)
            })

            socket.on(SocketEvent.ROOM_JOIN, (request: any) => {
                console.log(`[server]: room join request received, id: ${request.roomId}, passphrase: “${request.passphrase}”`)
                let status: string
                console.log('this.rsooms: ', this.rooms)
                console.log('request.roomId: ', request.roomId)
                const room = this.rooms.get(request.roomId)
                if (room != null) {
                    // Requested room exists
                    if (request.passphrase === room.passphrase) {
                        status = 'success'
                        socket.join(request.roomId)
                    } else {
                        status = 'failed'
                    }
                } else {
                    status = 'not_found'
                }
                socket.emit(SocketEvent.ROOM_JOIN_CALLBACK, status)
            })

            socket.on(SocketEvent.ROOM_USER_JOIN, () => {

            })

            socket.on(SocketEvent.ROOM_USER_QUIT, () => {

            })

            socket.on(SocketEvent.ROOM_VIDEO_UPDATE, ({ roomId, data }) => {
                // Broadcast image to everyone else in that room
                console.log(`room_video_update. roomId: ${roomId}`)
                socket.to(roomId).emit(SocketEvent.ROOM_VIDEO_UPDATE, data)
            })

            socket.on(SocketEvent.DISCONNECT, (socket: any) => {
                console.log(`[socket ${socket.id}]: disconnected (socket)`)
            })

            this.signalServer.on(SocketEvent.SIGNAL_DISCOVER, (request: any) => {
                console.log(`[socket ${request.socket.id}]: discovering peers`)
                // Looks for other clients in the specified room and returns their IDs
                const clientId: string = request.socket.id
                const peers = this.server.sockets.adapter.rooms[request.discoveryData].sockets
                const peerIds: string[] = Object.keys(peers)

                request.discover(clientId, peerIds)
            })

            this.signalServer.on(SocketEvent.DISCONNECT, (socket: any) => {
                console.log(`[socket ${socket.id}]: disconnected (signal)`)
            })

            // this.signalServer.on(SocketEvent.SIGNAL_REQUEST, (request: any) => {
            //     console.log(`[socket ${socket.id}]: requested`)
            //     request.forward()
            // })
        })
    }

    get server(): io.Server {
        return this._server
    }
}