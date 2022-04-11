"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var roomsRoute_1 = __importDefault(require("./routes/roomsRoute"));
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
    socket.on(RoomEvent_1.RoomEvent.CREATE_ROOM, function (_a) {
        var newRoom = _a.newRoom;
        socket.join(newRoom.roomId);
        //welcome client to room
        var msg = { sender: "server", text: "Welcome to Watch-app room" };
        socket.emit(RoomEvent_1.RoomEvent.CLIENT_GET_MSG, { msg: msg });
        // broadcast an new Room except
        socket.broadcast.emit(RoomEvent_1.RoomEvent.CREATED_ROOM, { newRoom: newRoom });
    });
    socket.on(RoomEvent_1.RoomEvent.JOIN_ROOM, function (_a) {
        var roomId = _a.roomId, userId = _a.userId;
        socket.join(roomId);
        //welcome client to room
        var msg = { sender: "server", text: "Welcome to Watch-app room" };
        socket.emit(RoomEvent_1.RoomEvent.CLIENT_GET_MSG, { msg: msg });
        // broadcast when a user connects
        socket.broadcast.emit(RoomEvent_1.RoomEvent.JOINED_ROOM, { roomId: roomId, userId: userId });
    });
    socket.on(RoomEvent_1.RoomEvent.LEAVE_ROOM, function (_a) {
        var roomId = _a.roomId, userId = _a.userId;
        socket.leave(roomId);
        socket.broadcast.to(roomId).emit(RoomEvent_1.RoomEvent.LEFT_ROOM, { userId: userId });
    });
    socket.on(RoomEvent_1.RoomEvent.CLIENT_SEND_MSG, function (_a) {
        var roomId = _a.roomId, msg = _a.msg;
        //send Msg to other in the room
        socket.broadcast.to(roomId).emit(RoomEvent_1.RoomEvent.CLIENT_GET_MSG, { msg: msg });
    });
    socket.on(RoomEvent_1.RoomEvent.VIDEO_UPDATING, function (_a) {
        var videoUpdate = _a.videoUpdate, roomId = _a.roomId;
        //broadcast video to roomId except sender
        socket.broadcast
            .to(roomId)
            .emit(RoomEvent_1.RoomEvent.VIDEO_UPDATED, { updatedVideo: videoUpdate });
        //send back to admin
        socket.emit(RoomEvent_1.RoomEvent.VIDEO_UPDATED, { updatedVideo: videoUpdate });
    });
});
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/watch-app/rooms", roomsRoute_1.default);
app.get("/watch-app/user", (function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId;
    return __generator(this, function (_a) {
        try {
            userId = (0, uuid_1.v4)();
            res.status(200).json(userId);
        }
        catch (err) {
            throw err;
        }
        return [2 /*return*/];
    });
}); }));
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
