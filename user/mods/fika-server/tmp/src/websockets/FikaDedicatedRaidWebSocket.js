"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FikaDedicatedRaidWebSocket = void 0;
const tsyringe_1 = require("tsyringe");
const ws_1 = require("ws");
let FikaDedicatedRaidWebSocket = class FikaDedicatedRaidWebSocket {
    logger;
    clientWebSockets;
    constructor(logger) {
        this.logger = logger;
        this.clientWebSockets = {};
        // Keep websocket connections alive
        setInterval(() => {
            this.keepWebSocketAlive();
        }, 30000);
    }
    getSocketId() {
        return "FikaDedicatedRaidService";
    }
    getHookUrl() {
        return "/fika/dedicatedraidservice/";
    }
    onConnection(ws, req) {
        // Strip request and break it into sections
        const splitUrl = req.url.substring(0, req.url.indexOf("?")).split("/");
        const sessionID = splitUrl.pop();
        this.clientWebSockets[sessionID] = ws;
        ws.on("message", (msg) => this.onMessage(sessionID, msg.toString()));
    }
    onMessage(sessionID, msg) {
        // Do nothing
    }
    keepWebSocketAlive() {
        for (const sessionId in this.clientWebSockets) {
            const clientWebSocket = this.clientWebSockets[sessionId];
            if (clientWebSocket.readyState == ws_1.WebSocket.CLOSED) {
                delete this.clientWebSockets[sessionId];
                return;
            }
            // Send a keep alive message to the dedicated client
            clientWebSocket.send(JSON.stringify({
                type: "fikaDedicatedKeepAlive"
            }));
        }
    }
};
exports.FikaDedicatedRaidWebSocket = FikaDedicatedRaidWebSocket;
exports.FikaDedicatedRaidWebSocket = FikaDedicatedRaidWebSocket = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __metadata("design:paramtypes", [Object])
], FikaDedicatedRaidWebSocket);
