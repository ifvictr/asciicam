export enum SocketEvent {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    MESSAGE = 'message',
    ROOM_CREATE = 'room_create',
    ROOM_CREATE_CALLBACK = 'room_create_callback',
    ROOM_JOIN = 'room_join',
    ROOM_JOIN_CALLBACK = 'room_join_callback',
    ROOM_USER_JOIN = 'room_user_join',
    ROOM_USER_QUIT = 'room_user_quit',
    SIGNAL_DISCOVER = 'discover',
    SIGNAL_REQUEST = 'request'
}