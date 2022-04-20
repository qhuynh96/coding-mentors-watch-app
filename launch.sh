#!/bin/sh

# start client & server
(cd client && serve -s -n build) & (cd server && npm start)
# TODO: move this file into the Dockerfile (without relying on another npm package (ie. concurrently, npm-run-all, ...))
