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
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var uuid_1 = require("uuid");
var rooms_1 = require("../rooms/rooms");
var router = (0, express_1.Router)();
//Create room
router.post("/", (function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, newRoom, room;
    return __generator(this, function (_a) {
        userId = req.body.userId;
        newRoom = {
            roomId: (0, uuid_1.v4)(),
            admin: userId,
            members: [userId],
            onPlay: {},
            videos: [],
        };
        try {
            room = (0, rooms_1.createRoom)(newRoom);
            res.status(200).json(room);
        }
        catch (err) {
            res.status(500).json(err);
        }
        return [2 /*return*/];
    });
}); }));
//join a room
router.put("/join/:roomId", (function (req, res) {
    var roomId = req.params.roomId;
    var userId = req.body.userId;
    try {
        var room = (0, rooms_1.joinRoom)({ userId: userId, roomId: roomId });
        res.status(200).json(room);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//Get a room
router.get("/:roomId", (function (req, res) {
    var roomId = req.params.roomId;
    try {
        var room = (0, rooms_1.findRoom)(roomId);
        res.status(200).json(room);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//Get rooms
router.get("/", (function (req, res) {
    try {
        var rooms = (0, rooms_1.getRooms)();
        res.status(200).json(rooms);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//Leave room
router.put("/leave/:roomId", (function (req, res) {
    var roomId = req.params.roomId;
    var userId = req.body.userId;
    try {
        var room = (0, rooms_1.leaveRoom)({ userId: userId, roomId: roomId });
        res.status(200).json(room);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//update Video
router.put("/onPlay/:roomId", (function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var roomId, _a, url, playing, latestUpdateAt, progress, playingVideo, room, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                roomId = req.params.roomId;
                _a = req.body, url = _a.url, playing = _a.playing, latestUpdateAt = _a.latestUpdateAt, progress = _a.progress;
                playingVideo = { url: url, playing: playing, latestUpdateAt: latestUpdateAt, progress: progress };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, rooms_1.updateVideoOnPlay)(playingVideo, roomId)];
            case 2:
                room = _b.sent();
                res.status(200).json(room.onPlay);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                res.status(500).json(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); }));
//add video
router.post("/:roomId/videos", (function (req, res) {
    var roomId = req.params.roomId;
    var url = req.body.url;
    try {
        var room = (0, rooms_1.addVideo)(url, roomId);
        res.status(200).json(room);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
exports.default = router;
