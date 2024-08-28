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
exports.FikaRaidController = void 0;
const tsyringe_1 = require("tsyringe");
const ws_1 = require("ws");
const InraidController_1 = require("@spt/controllers/InraidController");
const ProfileHelper_1 = require("@spt/helpers/ProfileHelper");
const DedicatedStatus_1 = require("../models/enums/DedicatedStatus");
const FikaMatchEndSessionMessages_1 = require("../models/enums/FikaMatchEndSessionMessages");
const FikaMatchService_1 = require("../services/FikaMatchService");
const FikaDedicatedRaidService_1 = require("../services/dedicated/FikaDedicatedRaidService");
const FikaDedicatedRaidWebSocket_1 = require("../websockets/FikaDedicatedRaidWebSocket");
let FikaRaidController = class FikaRaidController {
    fikaMatchService;
    fikaDedicatedRaidService;
    fikaDedicatedRaidWebSocket;
    profileHelper;
    logger;
    inraidController;
    constructor(fikaMatchService, fikaDedicatedRaidService, fikaDedicatedRaidWebSocket, profileHelper, logger, inraidController) {
        this.fikaMatchService = fikaMatchService;
        this.fikaDedicatedRaidService = fikaDedicatedRaidService;
        this.fikaDedicatedRaidWebSocket = fikaDedicatedRaidWebSocket;
        this.profileHelper = profileHelper;
        this.logger = logger;
        this.inraidController = inraidController;
        // empty
    }
    /**
     * Handle /fika/raid/create
     * @param request
     */
    handleRaidCreate(request) {
        return {
            success: this.fikaMatchService.createMatch(request),
        };
    }
    /**
     * Handle /fika/raid/join
     * @param request
     */
    handleRaidJoin(request) {
        const match = this.fikaMatchService.getMatch(request.serverId);
        return {
            serverId: request.serverId,
            timestamp: match.timestamp,
            expectedNumberOfPlayers: match.expectedNumberOfPlayers,
            gameVersion: match.gameVersion,
            fikaVersion: match.fikaVersion,
            raidCode: match.raidCode,
        };
    }
    /**
     * Handle /fika/raid/leave
     * @param request
     */
    handleRaidLeave(request) {
        if (request.serverId === request.profileId) {
            this.fikaMatchService.endMatch(request.serverId, FikaMatchEndSessionMessages_1.FikaMatchEndSessionMessage.HOST_SHUTDOWN_MESSAGE);
            return;
        }
        this.fikaMatchService.removePlayerFromMatch(request.serverId, request.profileId);
    }
    /**
     * Handle /fika/raid/gethost
     * @param request
     */
    handleRaidGetHost(request) {
        const match = this.fikaMatchService.getMatch(request.serverId);
        if (!match) {
            return;
        }
        return {
            ips: match.ips,
            port: match.port,
            natPunch: match.natPunch,
            isDedicated: match.isDedicated,
        };
    }
    /**
     * Handle /fika/raid/getsettings
     * @param request
     */
    handleRaidGetSettings(request) {
        const match = this.fikaMatchService.getMatch(request.serverId);
        if (!match) {
            return;
        }
        return {
            metabolismDisabled: match.raidConfig.metabolismDisabled,
            playersSpawnPlace: match.raidConfig.playersSpawnPlace,
        };
    }
    /** Handle /fika/raid/dedicated/start */
    handleRaidStartDedicated(sessionID, info) {
        if (!this.fikaDedicatedRaidService.isDedicatedClientAvailable()) {
            return {
                matchId: null,
                error: "No dedicated clients available.",
            };
        }
        if (sessionID in this.fikaDedicatedRaidService.dedicatedClients) {
            return {
                matchId: null,
                error: "You are trying to connect to a dedicated client while having Fika.Dedicated installed. Please remove Fika.Dedicated from your client and try again.",
            };
        }
        let dedicatedClient = undefined;
        let dedicatedClientWs = undefined;
        for (const dedicatedSessionId in this.fikaDedicatedRaidService.dedicatedClients) {
            const dedicatedClientInfo = this.fikaDedicatedRaidService.dedicatedClients[dedicatedSessionId];
            if (dedicatedClientInfo.state != DedicatedStatus_1.DedicatedStatus.READY) {
                continue;
            }
            dedicatedClientWs = this.fikaDedicatedRaidWebSocket.clientWebSockets[dedicatedSessionId];
            if (!dedicatedClientWs || dedicatedClientWs.readyState == ws_1.WebSocket.CLOSED) {
                continue;
            }
            dedicatedClient = dedicatedSessionId;
            break;
        }
        if (!dedicatedClient) {
            return {
                matchId: null,
                error: "No dedicated clients available at this time.",
            };
        }
        const pmcDedicatedClientProfile = this.profileHelper.getPmcProfile(dedicatedClient);
        const requesterProfile = this.profileHelper.getPmcProfile(sessionID);
        this.logger.debug(`Dedicated: ${pmcDedicatedClientProfile.Info.Nickname} ${pmcDedicatedClientProfile.Info.Level} - Requester: ${requesterProfile.Info.Nickname} ${requesterProfile.Info.Level}`);
        //Set level of the dedicated profile to the person that has requested the raid to be started.
        pmcDedicatedClientProfile.Info.Level = requesterProfile.Info.Level;
        pmcDedicatedClientProfile.Info.Experience = requesterProfile.Info.Experience;
        this.fikaDedicatedRaidService.requestedSessions[dedicatedClient] = sessionID;
        dedicatedClientWs.send(JSON.stringify({
            type: "fikaDedicatedStartRaid",
            ...info,
        }));
        this.logger.info(`Sent WS fikaDedicatedStartRaid to ${dedicatedClient}`);
        return {
            // This really isn't required, I just want to make sure on the client
            matchId: dedicatedClient,
            error: null,
        };
    }
    /** Handle /fika/raid/dedicated/status */
    handleRaidStatusDedicated(sessionId, info) {
        // Temp fix because the enum gets deserialized as a string instead of an integer
        switch (info.status.toString()) {
            case "READY":
                info.status = DedicatedStatus_1.DedicatedStatus.READY;
                break;
            case "IN_RAID":
                info.status = DedicatedStatus_1.DedicatedStatus.IN_RAID;
                break;
        }
        if (info.status == DedicatedStatus_1.DedicatedStatus.READY && !this.fikaDedicatedRaidService.isDedicatedClientAvailable()) {
            if (this.fikaDedicatedRaidService.onDedicatedClientAvailable) {
                this.fikaDedicatedRaidService.onDedicatedClientAvailable();
            }
        }
        this.fikaDedicatedRaidService.dedicatedClients[sessionId] = {
            state: info.status,
            lastPing: Date.now(),
        };
        return {
            sessionId: info.sessionId,
            status: info.status,
        };
    }
    /** Handle /fika/raid/dedicated/getstatus */
    handleRaidGetStatusDedicated() {
        return {
            available: this.fikaDedicatedRaidService.isDedicatedClientAvailable(),
        };
    }
    /** Handle /fika/raid/dedicated/registerPlayer */
    handleRaidRegisterPlayer(sessionId, info) {
        this.inraidController.addPlayer(sessionId, info);
    }
};
exports.FikaRaidController = FikaRaidController;
exports.FikaRaidController = FikaRaidController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaMatchService")),
    __param(1, (0, tsyringe_1.inject)("FikaDedicatedRaidService")),
    __param(2, (0, tsyringe_1.inject)("FikaDedicatedRaidWebSocket")),
    __param(3, (0, tsyringe_1.inject)("ProfileHelper")),
    __param(4, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(5, (0, tsyringe_1.inject)("InraidController")),
    __metadata("design:paramtypes", [FikaMatchService_1.FikaMatchService,
        FikaDedicatedRaidService_1.FikaDedicatedRaidService,
        FikaDedicatedRaidWebSocket_1.FikaDedicatedRaidWebSocket,
        ProfileHelper_1.ProfileHelper, Object, InraidController_1.InraidController])
], FikaRaidController);
