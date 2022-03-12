"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomEvent = void 0;
var http_errors_1 = __importDefault(require("http-errors"));
var express_1 = __importDefault(require("express"));
var socket_io_1 = require("socket.io");
var path_1 = __importDefault(require("path"));
var cors_1 = __importDefault(require("cors"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var morgan_1 = __importDefault(require("morgan"));
var http_1 = require("http");
var rooms_1 = require("./utils/rooms");
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
var rooms = {};
//Socket Events
var RoomEvent;
(function (RoomEvent) {
    RoomEvent["connection"] = "connection";
    RoomEvent["CREATE_ROOM"] = "CREATE_ROOM";
    RoomEvent["JOIN_ROOM"] = "JOIN_ROOM";
    RoomEvent["LEAVE_ROOM"] = "LEAVE_ROOM";
    RoomEvent["SERVER_ROOMS"] = "SERVER_ROOMS";
    RoomEvent["JOINED_ROOM"] = "JOINED_ROOM";
    RoomEvent["CREATED_ROOM"] = "CREATED_ROOM";
})(RoomEvent = exports.RoomEvent || (exports.RoomEvent = {}));
/**Run when client connect */
io.on(RoomEvent.connection, function (socket) {
    console.log("user connected ".concat(socket.id));
    var rooms = (0, rooms_1.getRooms)();
    console.log(rooms);
    socket.emit(RoomEvent.SERVER_ROOMS, rooms);
    /**Create New Room */
    socket.on(RoomEvent.CREATE_ROOM, function (_a) {
        var roomId = _a.roomId;
        //add a new room to the room list 
        var room = { admin: socket.id, members: [socket.id], roomId: roomId };
        var newRoom = (0, rooms_1.createRoom)(room);
        //join Room 
        socket.join(roomId);
        //broadcast an event saying there is a new room
        socket.broadcast.emit(RoomEvent.CREATED_ROOM, newRoom);
    });
    /**Join room */
    socket.on(RoomEvent.JOIN_ROOM, function (_a) {
        var roomId = _a.roomId;
        var res = (0, rooms_1.joinRoom)({ roomId: roomId, userId: socket.id });
        socket.join(res.roomId);
        // Broadcast when a user connects 
        socket.broadcast.emit(RoomEvent.JOINED_ROOM, res);
    });
    /**Leave room */
    socket.on(RoomEvent.LEAVE_ROOM, function (_a) {
        var roomId = _a.roomId, userId = _a.userId;
        (0, rooms_1.leaveRoom)({ userId: userId, roomId: roomId });
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
