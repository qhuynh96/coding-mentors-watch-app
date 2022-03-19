"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveRoom = exports.joinRoom = exports.createRoom = exports.getRooms = void 0;
var rooms = [];
//Get rooms
var getRooms = function () {
    return rooms;
};
exports.getRooms = getRooms;
//Create room
var createRoom = function (room) {
    if (!rooms.some(function (r) { return r.roomId === room.roomId; })) {
        rooms.push(room);
    }
    return room;
};
exports.createRoom = createRoom;
//Join room
var joinRoom = function (_a) {
    var userId = _a.userId, roomId = _a.roomId;
    rooms.map(function (room) {
        return room.roomId === roomId ? room.members.push(userId) : null;
    });
    var res = { userId: userId, roomId: roomId };
    return res;
};
exports.joinRoom = joinRoom;
//Leave room
var leaveRoom = function (_a) {
    var userId = _a.userId, roomId = _a.roomId;
};
exports.leaveRoom = leaveRoom;
