export enum SocketEvent {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    MESSAGE = 'message',
    ROOM_CREATE = 'room_create',
    ROOM_QUERY = 'room_query',
    ROOM_USER_JOIN = 'room_user_join',
    ROOM_USER_QUIT = 'room_user_quit'
}