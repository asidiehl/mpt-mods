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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MPTUpdateCallbacks = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const HttpResponseUtil_1 = require("C:/snapshot/project/obj/utils/HttpResponseUtil");
const MPTUpdateController_1 = require("../controllers/MPTUpdateController");
let MPTUpdateCallbacks = class MPTUpdateCallbacks {
    httpResponseUtil;
    mptUpdateController;
    constructor(httpResponseUtil, mptUpdateController) {
        this.httpResponseUtil = httpResponseUtil;
        this.mptUpdateController = mptUpdateController;
        // empty
    }
    /** Handle /mpt/update/ping */
    handlePing(url, info, sessionID) {
        this.mptUpdateController.handlePing(info);
        return this.httpResponseUtil.nullResponse();
    }
    /** Handle /mpt/update/spawnpoint */
    handleSpawnpoint(url, info, sessionID) {
        this.mptUpdateController.handleSpawnpoint(info);
        return this.httpResponseUtil.nullResponse();
    }
    /** Handle /mpt/update/playerspawn */
    handlePlayerspawn(url, info, sessionID) {
        this.mptUpdateController.handlePlayerspawn(info);
        return this.httpResponseUtil.nullResponse();
    }
    /** Handle /mpt/update/sethost */
    handleSethost(url, info, sessionID) {
        this.mptUpdateController.handleSethost(info);
        return this.httpResponseUtil.nullResponse();
    }
    /** Handle /mpt/update/setstatus */
    handleSetStatus(url, info, sessionID) {
        this.mptUpdateController.handleSetStatus(info);
        return this.httpResponseUtil.nullResponse();
    }
};
exports.MPTUpdateCallbacks = MPTUpdateCallbacks;
exports.MPTUpdateCallbacks = MPTUpdateCallbacks = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("HttpResponseUtil")),
    __param(1, (0, tsyringe_1.inject)("MPTUpdateController")),
    __metadata("design:paramtypes", [typeof (_a = typeof HttpResponseUtil_1.HttpResponseUtil !== "undefined" && HttpResponseUtil_1.HttpResponseUtil) === "function" ? _a : Object, typeof (_b = typeof MPTUpdateController_1.MPTUpdateController !== "undefined" && MPTUpdateController_1.MPTUpdateController) === "function" ? _b : Object])
], MPTUpdateCallbacks);
//# sourceMappingURL=MPTUpdateCallbacks.js.map