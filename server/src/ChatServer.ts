import SimpleSignalServer from 'simple-signal-server'
import io from 'socket.io'
import { SocketEvent } from './constants'
import { ChatMessage } from './types'

export class ChatServer {
    static readonly PORT: number = 8080
    private _server: io.Server
    private signalServer: any
    private port: string | number

    constructor() {
        this.port = process.env.PORT || ChatServer.PORT
        this._server = io()
        this.signalServer = new SimpleSignalServer(this._server)
        this.listen()
    }

    private listen(): void {
        this.server.listen(this.port)
        console.log('Listening on port ' + this.port)

        this.server.on(SocketEvent.CONNECT, (socket: any) => {
            console.log('Connected client on port %s.', this.port)

            socket.on(SocketEvent.MESSAGE, (m: ChatMessage) => {
                console.log('[server](message): %s', JSON.stringify(m))
                this.server.emit('message', m)
            })

            socket.on(SocketEvent.ROOM_CREATE, () => {

            })

            socket.on(SocketEvent.ROOM_QUERY, () => {

            })

            socket.on(SocketEvent.ROOM_USER_JOIN, () => {

            })

            socket.on(SocketEvent.ROOM_USER_QUIT, () => {

            })

            socket.on(SocketEvent.DISCONNECT, () => {
                console.log('Client disconnected')
            })
        })
    }

    get server(): io.Server {
        return this._server
    }
}