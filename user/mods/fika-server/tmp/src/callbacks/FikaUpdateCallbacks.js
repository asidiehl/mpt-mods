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
exports.FikaUpdateCallbacks = void 0;
const tsyringe_1 = require("tsyringe");
const HttpResponseUtil_1 = require("@spt/utils/HttpResponseUtil");
const FikaUpdateController_1 = require("../controllers/FikaUpdateController");
let FikaUpdateCallbacks = class FikaUpdateCallbacks {
    httpResponseUtil;
    fikaUpdateController;
    constructor(httpResponseUtil, fikaUpdateController) {
        this.httpResponseUtil = httpResponseUtil;
        this.fikaUpdateController = fikaUpdateController;
        // empty
    }
    /** Handle /fika/update/ping */
    handlePing(_url, info, _sessionID) {
        this.fikaUpdateController.handlePing(info);
        return this.httpResponseUtil.nullResponse();
    }
    /** Handle /fika/update/playerspawn */
    handlePlayerspawn(_url, info, _sessionID) {
        this.fikaUpdateController.handlePlayerspawn(info);
        return this.httpResponseUtil.nullResponse();
    }
    /** Handle /fika/update/sethost */
    handleSethost(_url, info, _sessionID) {
        this.fikaUpdateController.handleSethost(info);
        return this.httpResponseUtil.nullResponse();
    }
    /** Handle /fika/update/setstatus */
    handleSetStatus(_url, info, _sessionID) {
        this.fikaUpdateController.handleSetStatus(info);
        return this.httpResponseUtil.nullResponse();
    }
    /** Handle /fika/update/addplayer */
    handleRaidAddPlayer(_url, info, _sessionID) {
        this.fikaUpdateController.handleRaidAddPlayer(info);
        return this.httpResponseUtil.nullResponse();
    }
    /** Handle /fika/update/playerdied */
    handlePlayerDied(_url, info, _sessionID) {
        this.fikaUpdateController.handleRaidPlayerDied(info);
        return this.httpResponseUtil.nullResponse();
    }
};
exports.FikaUpdateCallbacks = FikaUpdateCallbacks;
exports.FikaUpdateCallbacks = FikaUpdateCallbacks = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("HttpResponseUtil")),
    __param(1, (0, tsyringe_1.inject)("FikaUpdateController")),
    __metadata("design:paramtypes", [HttpResponseUtil_1.HttpResponseUtil,
        FikaUpdateController_1.FikaUpdateController])
], FikaUpdateCallbacks);
