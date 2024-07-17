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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationCallbacksOverride = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const LocationController_1 = require("C:/snapshot/project/obj/controllers/LocationController");
const HttpResponseUtil_1 = require("C:/snapshot/project/obj/utils/HttpResponseUtil");
const MPTMatchService_1 = require("../../services/MPTMatchService");
const Override_1 = require("../../di/Override");
let LocationCallbacksOverride = class LocationCallbacksOverride extends Override_1.Override {
    locationController;
    httpResponseUtil;
    mptMatchService;
    constructor(locationController, httpResponseUtil, mptMatchService) {
        super();
        this.locationController = locationController;
        this.httpResponseUtil = httpResponseUtil;
        this.mptMatchService = mptMatchService;
    }
    execute(container) {
        container.afterResolution("LocationCallbacks", (_t, result) => {
            result.getLocation = (url, info, sessionId) => {
                const matchId = this.mptMatchService.getMatchIdByProfile(sessionId);
                if (matchId === undefined) {
                    // player isn't in a MPT match, generate new loot
                    return this.httpResponseUtil.getBody(this.locationController.get(sessionId, info));
                }
                // player is in a MPT match, use match location loot
                const match = this.mptMatchService.getMatch(matchId);
                return this.httpResponseUtil.getBody(match.locationData);
            };
        });
    }
};
exports.LocationCallbacksOverride = LocationCallbacksOverride;
exports.LocationCallbacksOverride = LocationCallbacksOverride = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("LocationController")),
    __param(1, (0, tsyringe_1.inject)("HttpResponseUtil")),
    __param(2, (0, tsyringe_1.inject)("MPTMatchService")),
    __metadata("design:paramtypes", [typeof (_a = typeof LocationController_1.LocationController !== "undefined" && LocationController_1.LocationController) === "function" ? _a : Object, typeof (_b = typeof HttpResponseUtil_1.HttpResponseUtil !== "undefined" && HttpResponseUtil_1.HttpResponseUtil) === "function" ? _b : Object, typeof (_c = typeof MPTMatchService_1.MPTMatchService !== "undefined" && MPTMatchService_1.MPTMatchService) === "function" ? _c : Object])
], LocationCallbacksOverride);
//# sourceMappingURL=LocationCallbacks.js.map