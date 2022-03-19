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
var http_1 = require("http");
var rooms_1 = require("./rooms/rooms");
var app = express_1.default();
app.use(cors_1.default({
    origin: "*",
}));
// create http server
var server = http_1.createServer(app);
// create the socket io server on top of the http server
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
// run once the client connects
io.on(RoomEvent_1.RoomEvent.connection, function (socket) {
    var rooms = rooms_1.getRooms();
    socket.emit(RoomEvent_1.RoomEvent.SERVER_ROOMS, { rooms: rooms, userId: socket.id });
    socket.on(RoomEvent_1.RoomEvent.CREATE_ROOM, function (_a) {
        var roomId = _a.roomId;
        // create a new room & append it to the current room array
        var newRoom = rooms_1.createRoom({
            admin: socket.id,
            members: [socket.id],
            roomId: roomId,
        });
        // join the new room
        socket.join(roomId);
        // broadcast an event saying there is a new room
        socket.broadcast.emit(RoomEvent_1.RoomEvent.CREATED_ROOM, newRoom);
        socket.emit(RoomEvent_1.RoomEvent.CREATED_ROOM, newRoom);
    });
    socket.on(RoomEvent_1.RoomEvent.JOIN_ROOM, function (_a) {
        var roomId = _a.roomId;
        var res = rooms_1.joinRoom({ roomId: roomId, userId: socket.id });
        socket.join(res.roomId);
        // broadcast when a user connects
        socket.broadcast.emit(RoomEvent_1.RoomEvent.JOINED_ROOM, res);
        socket.emit(RoomEvent_1.RoomEvent.JOINED_ROOM, res);
    });
    socket.on(RoomEvent_1.RoomEvent.LEAVE_ROOM, function (_a) {
        var roomId = _a.roomId, userId = _a.userId;
        rooms_1.leaveRoom({ userId: userId, roomId: roomId });
    });
});
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.get("/watch-app", (function (req, res) {
    res.status(200).json({
        message: "Successfully connected to ExpressJS server!",
    });
}));
// catch 404 and forward to error handler
app.use((function (req, res, next) {
    next(http_errors_1.default(404));
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
