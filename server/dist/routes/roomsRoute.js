"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var uuid_1 = require("uuid");
var rooms_1 = require("../rooms/rooms");
var router = (0, express_1.Router)();
//Create room
router.post("/", (function (req, res) {
    var userId = req.body.userId;
    var newRoom = {
        admin: userId,
        members: [userId],
        roomId: (0, uuid_1.v4)(),
        onPlay: {},
        videos: [],
    };
    try {
        var room = (0, rooms_1.createRoom)(newRoom);
        res.status(200).json(room);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
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
        console.log(err);
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
//update Video onPlay
router.put("/:roomId/playingVideo", (function (req, res) {
    var roomId = req.params.roomId;
    var _a = req.body, url = _a.url, playing = _a.playing, latestUpdateAt = _a.latestUpdateAt, progress = _a.progress;
    var playingVideo = { url: url, playing: playing, latestUpdateAt: latestUpdateAt, progress: progress };
    try {
        var room = (0, rooms_1.setVideoOnPlay)(playingVideo, roomId);
        res.status(200).json(room);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
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
