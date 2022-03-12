<<<<<<< HEAD
import createError from "http-errors";
import express, { RequestHandler, ErrorRequestHandler } from "express";
import { Server } from "socket.io";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
=======
const createError = require("http-errors");
const express = require("express");
import {RequestHandler, ErrorRequestHandler} from "express"
const { Server,Socket } = require('socket.io');
const {v4} = require('uuid')
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
>>>>>>> 7fb1b2f (create room socket at server)

import { createServer } from "http";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

// create http server
const server = createServer(app);

// create the socket io server on top of the http server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const rooms: Record<string, {members: string[],roomId: string}> = {}

//Socket Events
export const enum RoomEvent {
  CONNNECTION= 'CONNNECTION',
  CREATE_ROOM="CREATE_ROOM",
  JOIN_ROOM="JOIN_ROOM",
  SEND_ROOM="SEND_ROOM"
}

io.on(RoomEvent.CONNNECTION,(socket: typeof Socket)=>{
  console.log(`user connected ${socket.id}`)

  socket.on(RoomEvent.CREATE_ROOM, ({userId, roomId}: any)=>{
    
  //ad a new room to the room list 
  rooms[roomId] = {
    members:[userId],
    roomId,
  }
  //join Room /
  socket.join(roomId)
  //broadcast an event saying there is a new room 
  socket.broadcast.emit(RoomEvent.SEND_ROOM, rooms)
  //emit back to the room creator
  socket.emit(RoomEvent.SEND_ROOM, rooms)
  //emit event back the room creator 
  })
 
})

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/watch-app", ((req, res) => {
  res.status(200).json({
    message: "Successfully connected to ExpressJS server!",
  });
}) as RequestHandler);

// catch 404 and forward to error handler
app.use(((req, res, next) => {
  next(createError(404));
}) as RequestHandler);

// error handler
app.use(((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
}) as  ErrorRequestHandler);

module.exports = { app: app, server: server };
