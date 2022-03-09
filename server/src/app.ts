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
import { RequestHandler, ErrorRequestHandler } from "express";
import { Server,Socket } from "socket.io";
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

const rooms: Record<string, {name: string,admin: string}> = {}

//Socket Events
const EVENTS ={
  connection: 'connection',
  CLIENT: {
      CREATE_ROOM: "CREATE_ROOM"
  },
  SERVER:{
    ROOMS:'ROOMS',
    JOINED_ROOM: 'JOINED_ROOM'
  }
}

io.on(EVENTS.connection,(socket: Socket)=>{
  console.log(`user connected ${socket.id}`)

  socket.on(EVENTS.CLIENT.CREATE_ROOM, ({roomName,userId})=>{
      console.log(({roomName}))
  //create a roomId 
  const roomId = v4()
  //ad a new room to the room list 
  rooms[roomId] = {
    admin: userId,
    name: roomName,
  }
  //join Room /
  socket.join(roomId)
  //broadcast an event saying there is a new room 
  socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms)
  //emit back to the room creator
  socket.emit(EVENTS.SERVER.ROOMS, rooms)
  //emit event back the room creator 
  socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId)
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
}) as ErrorRequestHandler);

module.exports = { app: app, server: server };
