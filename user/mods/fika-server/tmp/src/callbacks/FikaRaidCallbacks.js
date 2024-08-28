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
exports.FikaRaidCallbacks = void 0;
const tsyringe_1 = require("tsyringe");
const HttpResponseUtil_1 = require("@spt/utils/HttpResponseUtil");
const FikaRaidController_1 = require("../controllers/FikaRaidController");
let FikaRaidCallbacks = class FikaRaidCallbacks {
    httpResponseUtil;
    fikaRaidController;
    constructor(httpResponseUtil, fikaRaidController) {
        this.httpResponseUtil = httpResponseUtil;
        this.fikaRaidController = fikaRaidController;
        // empty
    }
    /** Handle /fika/raid/create */
    handleRaidCreate(_url, info, _sessionID) {
        return this.httpResponseUtil.noBody(this.fikaRaidController.handleRaidCreate(info));
    }
    /** Handle /fika/raid/join */
    handleRaidJoin(_url, info, _sessionID) {
        return this.httpResponseUtil.noBody(this.fikaRaidController.handleRaidJoin(info));
    }
    /** Handle /fika/raid/leave */
    handleRaidLeave(_url, info, _sessionID) {
        this.fikaRaidController.handleRaidLeave(info);
        return this.httpResponseUtil.nullResponse();
    }
    /** Handle /fika/raid/gethost */
    handleRaidGetHost(_url, info, _sessionID) {
        return this.httpResponseUtil.noBody(this.fikaRaidController.handleRaidGetHost(info));
    }
    /** Handle /fika/raid/getsettings */
    handleRaidGetSettings(_url, info, _sessionID) {
        return this.httpResponseUtil.noBody(this.fikaRaidController.handleRaidGetSettings(info));
    }
    /** Handle /fika/raid/dedicated/start */
    handleRaidStartDedicated(_url, info, sessionID) {
        return this.httpResponseUtil.noBody(this.fikaRaidController.handleRaidStartDedicated(sessionID, info));
    }
    /** Handle /fika/raid/dedicated/status */
    handleRaidStatusDedicated(_url, info, sessionID) {
        return this.httpResponseUtil.noBody(this.fikaRaidController.handleRaidStatusDedicated(sessionID, info));
    }
    /** Handle /fika/raid/dedicated/getstatus */
    handleRaidGetStatusDedicated(_url, _info, _sessionID) {
        return this.httpResponseUtil.noBody(this.fikaRaidController.handleRaidGetStatusDedicated());
    }
    /** Handle /fika/raid/dedicated/registerPlayer */
    handleRaidRegisterPlayer(_url, info, sessionID) {
        this.fikaRaidController.handleRaidRegisterPlayer(sessionID, info);
        return this.httpResponseUtil.nullResponse();
    }
};
exports.FikaRaidCallbacks = FikaRaidCallbacks;
exports.FikaRaidCallbacks = FikaRaidCallbacks = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("HttpResponseUtil")),
    __param(1, (0, tsyringe_1.inject)("FikaRaidController")),
    __metadata("design:paramtypes", [HttpResponseUtil_1.HttpResponseUtil,
        FikaRaidController_1.FikaRaidController])
], FikaRaidCallbacks);
