import shortid from 'shortid'
import SimpleSignalServer from 'simple-signal-server'
import io from 'socket.io'
import { SocketEvent } from './constants'
import { Room } from './types'

export class ChatServer {
    static readonly PORT: number = 8080
    private _server: io.Server
    private signalServer: any
    private port: string | number
    private rooms: Map<string, Room>

    constructor() {
        this.port = process.env.PORT || ChatServer.PORT
        this._server = io()
        this.signalServer = new SimpleSignalServer(this._server)
        this.rooms = new Map()
        this.listen()
    }

    private listen(): void {
        this.server.listen(this.port)
        console.log(`[server](message): listening on port ${this.port}`)

        this.server.on(SocketEvent.CONNECT, (socket: any) => {
            console.log(`[socket ${socket.id}]: connected`)

            socket.on(SocketEvent.MESSAGE, (message: any) => {
                console.log(`[server]: (message) ${JSON.stringify(message)}`)
                this.server.emit('message', message)
            })

            socket.on(SocketEvent.ROOM_CREATE, (passphrase: string) => {
                const roomId: string = shortid.generate()
                this.rooms.set(roomId, { passphrase })
                socket.join(roomId)
                socket.emit(SocketEvent.ROOM_CREATE_CALLBACK, roomId)
                console.log(`[server]: room created, id: ${roomId}`)
                console.log(this.rooms)
            })

            socket.on(SocketEvent.ROOM_JOIN, (request: any) => {
                console.log(`[server]: room join request received, id: ${request.roomId}, passphrase: “${request.passphrase}”`)
                let status: string
                console.log('this.rooms: ', this.rooms)
                console.log('request.roomId: ', request.roomId)
                if (this.rooms.has(request.roomId)) {
                    // Requested room exists
                    const roomData: Room = this.rooms.get(request.roomId)
                    status = request.passphrase === roomData.passphrase ? 'success' : 'failed'
                } else {
                    status = 'not_found'
                }
                socket.emit(SocketEvent.ROOM_JOIN_CALLBACK, status)
            })

            socket.on(SocketEvent.ROOM_USER_JOIN, () => {

            })

            socket.on(SocketEvent.ROOM_USER_QUIT, () => {

            })

            socket.on(SocketEvent.DISCONNECT, (socket: any) => {
                console.log(`[socket ${socket.id}]: disconnected (socket)`)
            })

            this.signalServer.on(SocketEvent.SIGNAL_DISCOVER, (request: any) => {
                console.log(`[socket ${socket.id}]: discovering peers`)
                // Looks for other clients in the specified room and returns their IDs
                const clientId: string = request.socket.id
                const peers = this.server.sockets.adapter.rooms[request.discoveryData].sockets
                const peerIds: string[] = Object.keys(peers)

                request.discover(clientId, peerIds)
            })

            this.signalServer.on(SocketEvent.DISCONNECT, (socket: any) => {
                console.log(`[socket ${socket.id}]: disconnected (signal)`)
            })

            this.signalServer.on(SocketEvent.SIGNAL_REQUEST, (request: any) => {
                console.log(`[socket ${socket.id}]: requested`)
                request.forward()
            })
        })
    }

    get server(): io.Server {
        return this._server
    }
}