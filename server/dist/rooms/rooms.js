"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveRoom = exports.joinRoom = exports.createRoom = exports.findRoom = exports.getRooms = exports.addVideo = exports.setVideoOnPlay = void 0;
var http_errors_1 = __importDefault(require("http-errors"));
var rooms = new Map();
var setVideoOnPlay = function (playingVideo, roomId) {
    if (rooms.has(roomId)) {
        var room = rooms.get(roomId);
        room.onPlay = playingVideo;
        var roomInfo = rooms.get(roomId);
        return roomInfo;
    }
    else {
        return (0, http_errors_1.default)(404);
    }
};
exports.setVideoOnPlay = setVideoOnPlay;
var addVideo = function (url, roomId) {
    if (rooms.has(roomId)) {
        var room = rooms.get(roomId);
        if (!(room === null || room === void 0 ? void 0 : room.videos.some(function (v) { return v === url; }))) {
            room === null || room === void 0 ? void 0 : room.videos.push(url);
        }
        return room;
    }
    else {
        return (0, http_errors_1.default)(404);
    }
};
exports.addVideo = addVideo;
var getRooms = function () {
    if (rooms) {
        return rooms.values();
    }
    else {
        return (0, http_errors_1.default)(404);
    }
};
exports.getRooms = getRooms;
var findRoom = function (roomId) {
    if (rooms.has(roomId)) {
        var room = rooms.get(roomId);
        return room;
    }
    else {
        return (0, http_errors_1.default)(404);
    }
};
exports.findRoom = findRoom;
var createRoom = function (newRoom) {
    // check if the new room's ID does not already exist
    if (!rooms.has(newRoom.roomId)) {
        rooms.set(newRoom.roomId, newRoom);
        return newRoom;
    }
    else {
        return (0, http_errors_1.default)(404);
    }
};
exports.createRoom = createRoom;
var joinRoom = function (_a) {
    var userId = _a.userId, roomId = _a.roomId;
    if (rooms.has(roomId)) {
        var room = rooms.get(roomId);
        if (!room.members.some(function (member) { return member === userId; })) {
            room.members.push(userId);
        }
        var roomInfo = rooms.get(roomId);
        return roomInfo;
    }
    else {
        return (0, http_errors_1.default)(404);
    }
};
exports.joinRoom = joinRoom;
var leaveRoom = function (_a) {
    var userId = _a.userId, roomId = _a.roomId;
    if (rooms.has(roomId)) {
        var room = rooms.get(roomId);
        if (room.members.some(function (member) { return member === userId; })) {
            room.members.splice(room.members.indexOf(userId), 1);
        }
        var roomInfo = rooms.get(roomId);
        return roomInfo;
    }
    else {
        return (0, http_errors_1.default)(404);
    }
};
exports.leaveRoom = leaveRoom;
