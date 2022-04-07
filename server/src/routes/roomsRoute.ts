import { RequestHandler, Router } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  addVideo,
  createRoom,
  findRoom,
  getRooms,
  IVideo,
  joinRoom,
  leaveRoom,
  updateVideoOnPlay,
} from "../rooms/rooms";

const router = Router();

//Create room
router.post("/", (async (req, res) => {
  const userId = req.body.userId;
  const newRoom = {
    roomId: uuidv4(),

    admin: userId,
    members: [userId],
    onPlay: {} as IVideo,
    videos: [] as string[],
  };
  try {
    const room = createRoom(newRoom);
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json(err);
  }
}) as RequestHandler);

//join a room
router.put("/join/:roomId", ((req, res) => {
  const roomId = req.params.roomId;
  const userId = req.body.userId;
  try {
    const room = joinRoom({ userId, roomId });
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json(err);
  }
}) as RequestHandler);

//Get a room
router.get("/:roomId", ((req, res) => {
  const roomId = req.params.roomId;
  try {
    const room = findRoom(roomId);
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json(err);
  }
}) as RequestHandler);

//Get rooms
router.get("/", ((req, res) => {
  try {
    const rooms = getRooms();
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json(err);
  }
}) as RequestHandler);

//Leave room
router.put("/leave/:roomId", ((req, res) => {
  const roomId = req.params.roomId;
  const userId = req.body.userId;
  try {
    const room = leaveRoom({ userId, roomId });
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json(err);
  }
}) as RequestHandler);

//update Video
router.put("/onPlay/:roomId", (async (req, res) => {
  const roomId = req.params.roomId;
  const { url, playing, latestUpdateAt, progress } = req.body;
  const playingVideo = { url, playing, latestUpdateAt, progress };
  try {
    const room = await updateVideoOnPlay(playingVideo, roomId);
    res.status(200).json(room.onPlay);
  } catch (err) {
    res.status(500).json(err);
  }
}) as RequestHandler);

//add video
router.post("/:roomId/videos", ((req, res) => {
  const roomId = req.params.roomId;
  const url = req.body.url;
  try {
    const room = addVideo(url, roomId);
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json(err);
  }
}) as RequestHandler);

export default router;
