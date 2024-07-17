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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MPTRaidController = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const MPTMatchEndSessionMessages_1 = require("../models/enums/MPTMatchEndSessionMessages");
const MPTMatchService_1 = require("../services/MPTMatchService");
let MPTRaidController = class MPTRaidController {
    mptMatchService;
    constructor(mptMatchService) {
        this.mptMatchService = mptMatchService;
        // empty
    }
    /**
     * Handle /mpt/raid/create
     * @param request
     */
    handleRaidCreate(request) {
        return {
            success: this.mptMatchService.createMatch(request)
        };
    }
    /**
     * Handle /mpt/raid/join
     * @param request
     */
    handleRaidJoin(request) {
        this.mptMatchService.addPlayerToMatch(request.serverId, request.profileId, { groupId: null, isDead: false });
        const match = this.mptMatchService.getMatch(request.serverId);
        return {
            serverId: request.serverId,
            timestamp: match.timestamp,
            expectedNumberOfPlayers: match.expectedNumberOfPlayers,
            gameVersion: match.gameVersion,
            mptVersion: match.mptVersion
        };
    }
    /**
     * Handle /mpt/raid/leave
     * @param request
     */
    handleRaidLeave(request) {
        if (request.serverId === request.profileId) {
            this.mptMatchService.endMatch(request.serverId, MPTMatchEndSessionMessages_1.MPTMatchEndSessionMessage.HOST_SHUTDOWN_MESSAGE);
            return;
        }
        this.mptMatchService.removePlayerFromMatch(request.serverId, request.profileId);
    }
    /**
     * Handle /mpt/raid/gethost
     * @param request
     */
    handleRaidGethost(request) {
        const match = this.mptMatchService.getMatch(request.serverId);
        if (!match) {
            return;
        }
        return {
            ip: match.ip,
            port: match.port
        };
    }
    /**
     * Handle /mpt/raid/spawnpoint
     * @param request
     */
    handleRaidSpawnpoint(request) {
        const match = this.mptMatchService.getMatch(request.serverId);
        if (!match) {
            return;
        }
        return {
            spawnpoint: match.spawnPoint
        };
    }
};
exports.MPTRaidController = MPTRaidController;
exports.MPTRaidController = MPTRaidController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("MPTMatchService")),
    __metadata("design:paramtypes", [typeof (_a = typeof MPTMatchService_1.MPTMatchService !== "undefined" && MPTMatchService_1.MPTMatchService) === "function" ? _a : Object])
], MPTRaidController);
//# sourceMappingURL=MPTRaidController.js.map