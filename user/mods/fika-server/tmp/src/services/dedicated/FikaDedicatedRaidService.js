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
exports.FikaDedicatedRaidService = void 0;
const tsyringe_1 = require("tsyringe");
const FikaDedicatedRaidWebSocket_1 = require("../../websockets/FikaDedicatedRaidWebSocket");
let FikaDedicatedRaidService = class FikaDedicatedRaidService {
    fikaDedicatedRaidWebSocket;
    logger;
    dedicatedClients;
    requestedSessions;
    onNoDedicatedClientAvailable;
    onDedicatedClientAvailable;
    onDedicatedClientResponse;
    constructor(fikaDedicatedRaidWebSocket, logger) {
        this.fikaDedicatedRaidWebSocket = fikaDedicatedRaidWebSocket;
        this.logger = logger;
        this.dedicatedClients = {};
        this.requestedSessions = {};
        // TODO: find a more elegant solution to keep track of dedicated clients being available.
        setInterval(() => {
            const currentTime = Date.now();
            for (const dedicatedClientSessionId in this.dedicatedClients) {
                const dedicatedClientLastPing = this.dedicatedClients[dedicatedClientSessionId].lastPing;
                if (currentTime - dedicatedClientLastPing > 16000) {
                    delete this.dedicatedClients[dedicatedClientSessionId];
                    logger.info(`Dedicated client removed: ${dedicatedClientSessionId}`);
                }
                if (!this.isDedicatedClientAvailable()) {
                    if (this.onNoDedicatedClientAvailable) {
                        this.onNoDedicatedClientAvailable();
                    }
                }
            }
        }, 5000);
    }
    handleRequestedSessions(matchId) {
        if (matchId in this.requestedSessions) {
            const userToJoin = this.requestedSessions[matchId];
            this.fikaDedicatedRaidWebSocket.clientWebSockets[userToJoin].send(JSON.stringify({
                type: "fikaDedicatedJoinMatch",
                matchId: matchId,
            }));
            this.logger.info(`Told ${userToJoin} to join raid ${matchId}`);
        }
    }
    isDedicatedClientAvailable() {
        return Object.keys(this.dedicatedClients).length > 0;
    }
};
exports.FikaDedicatedRaidService = FikaDedicatedRaidService;
exports.FikaDedicatedRaidService = FikaDedicatedRaidService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaDedicatedRaidWebSocket")),
    __param(1, (0, tsyringe_1.inject)("WinstonLogger")),
    __metadata("design:paramtypes", [FikaDedicatedRaidWebSocket_1.FikaDedicatedRaidWebSocket, Object])
], FikaDedicatedRaidService);
