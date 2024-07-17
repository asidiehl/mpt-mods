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
exports.MPTUpdateController = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const MPTMatchService_1 = require("../services/MPTMatchService");
let MPTUpdateController = class MPTUpdateController {
    mptMatchService;
    constructor(mptMatchService) {
        this.mptMatchService = mptMatchService;
        // empty
    }
    /**
     * Handle /mpt/update/ping
     * @param request
     */
    handlePing(request) {
        this.mptMatchService.resetTimeout(request.serverId);
    }
    /**
     * Handle /mpt/update/spawnpoint
     * @param request
     */
    handleSpawnpoint(request) {
        this.mptMatchService.setMatchSpawnPoint(request.serverId, request.name);
    }
    /**
     * Handle /mpt/update/playerspawn
     * @param request
     */
    handlePlayerspawn(request) {
        this.mptMatchService.setPlayerGroup(request.serverId, request.profileId, request.groupId);
    }
    /**
     * Handle /mpt/update/sethost
     * @param request
     */
    handleSethost(request) {
        this.mptMatchService.setMatchHost(request.serverId, request.ip, request.port);
    }
    /**
     * Handle /mpt/update/setstatus
     * @param request
     */
    handleSetStatus(request) {
        this.mptMatchService.setMatchStatus(request.serverId, request.status);
    }
};
exports.MPTUpdateController = MPTUpdateController;
exports.MPTUpdateController = MPTUpdateController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("MPTMatchService")),
    __metadata("design:paramtypes", [typeof (_a = typeof MPTMatchService_1.MPTMatchService !== "undefined" && MPTMatchService_1.MPTMatchService) === "function" ? _a : Object])
], MPTUpdateController);
//# sourceMappingURL=MPTUpdateController.js.map