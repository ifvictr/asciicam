import * as express from 'express'
import * as io from 'socket.io'
import { ChatEvent } from './constants'
import { ChatMessage } from './types'
import { createServer, Server } from 'http'

export class ChatServer {
    public static readonly PORT: number = 8080
    private _app: express.Application
    private server: Server
    private io: io.Server
    private port: string | number

    constructor() {
        this._app = express()
        this.port = process.env.PORT || ChatServer.PORT
        this.server = createServer(this._app)
        this.initSocket()
        this.listen()
    }

    private initSocket(): void {
        this.io = io(this.server)
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port)
        });

        this.io.on(ChatEvent.CONNECT, (socket: any) => {
            console.log('Connected client on port %s.', this.port)

            socket.on(ChatEvent.MESSAGE, (m: ChatMessage) => {
                console.log('[server](message): %s', JSON.stringify(m))
                this.io.emit('message', m)
            });

            socket.on(ChatEvent.DISCONNECT, () => {
                console.log('Client disconnected')
            });
        });
    }

    get app(): express.Application {
        return this._app
    }
}