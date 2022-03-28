"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_errors_1 = __importDefault(require("http-errors"));
var express_1 = __importDefault(require("express"));
var socket_io_1 = require("socket.io");
var path_1 = __importDefault(require("path"));
var cors_1 = __importDefault(require("cors"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var morgan_1 = __importDefault(require("morgan"));
var RoomEvent_1 = require("./RoomEvent");
var uuid_1 = require("uuid");
var http_1 = require("http");
var rooms_1 = require("./rooms/rooms");
var app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
}));
// create http server
var server = (0, http_1.createServer)(app);
// create the socket io server on top of the http server
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
// run once the client connects
io.on(RoomEvent_1.RoomEvent.connection, function (socket) {
    var rooms = (0, rooms_1.getRooms)();
    //TODO Khang: change userId : uuid (install uuid)
    socket.emit(RoomEvent_1.RoomEvent.SERVER_ROOMS, { rooms: rooms, userId: (0, uuid_1.v4)() });
    socket.on(RoomEvent_1.RoomEvent.CREATE_ROOM, function (_a) {
        var roomId = _a.roomId, userId = _a.userId;
        // create a new room & append it to the current room array
        var newRoom = (0, rooms_1.createRoom)({
            admin: userId,
            members: [userId],
            roomId: roomId,
            onPlay: {},
            videos: [],
        });
        // join the new room
        socket.join(roomId);
        // broadcast an new Room except 
        socket.broadcast.emit(RoomEvent_1.RoomEvent.CREATED_ROOM, { newRoom: newRoom, userId: userId });
        // send back to room creator
        socket.emit(RoomEvent_1.RoomEvent.CREATED_ROOM, { newRoom: newRoom, userId: userId });
        // Navigate to new room
        socket.emit(RoomEvent_1.RoomEvent.NAVIGATE, { userId: userId, roomInfo: newRoom });
    });
    socket.on(RoomEvent_1.RoomEvent.JOIN_ROOM, function (_a) {
        var roomId = _a.roomId, userId = _a.userId;
        var res = (0, rooms_1.joinRoom)({ roomId: roomId, userId: userId });
        var roomInfo = res.roomInfo;
        socket.join(res.roomInfo.roomId);
        // broadcast when a user connects
        socket.broadcast.emit(RoomEvent_1.RoomEvent.JOINED_ROOM, { userId: userId, roomInfo: roomInfo });
        // send back to participant
        socket.emit(RoomEvent_1.RoomEvent.JOINED_ROOM, { userId: userId, roomInfo: roomInfo });
        // Navigate to the room
        socket.emit(RoomEvent_1.RoomEvent.NAVIGATE, { userId: userId, roomInfo: roomInfo });
    });
    socket.on(RoomEvent_1.RoomEvent.LEAVE_ROOM, function (_a) {
        var roomId = _a.roomId, userId = _a.userId;
        (0, rooms_1.leaveRoom)({ userId: userId, roomId: roomId });
    });
    /**Video on play */
    socket.on(RoomEvent_1.RoomEvent.SELECT_VIDEO, function (_a) {
        var videoOnPlay = _a.videoOnPlay, roomId = _a.roomId;
        var res = (0, rooms_1.setVideoOnPlay)(videoOnPlay, roomId);
        console.log(videoOnPlay);
        //broadcast to room except admin
        socket.broadcast.to(roomId).emit(RoomEvent_1.RoomEvent.VIDEO_ONPLAY, res.videoOnPlay);
    });
});
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.get("/watch-app", (function (req, res) {
    res.status(200).json({
        message: "Successfully connected to ExpressJS server!",
    });
}));
// catch 404 and forward to error handler
app.use((function (req, res, next) {
    next((0, http_errors_1.default)(404));
}));
// error handler
app.use((function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
}));
module.exports = { app: app, server: server };
