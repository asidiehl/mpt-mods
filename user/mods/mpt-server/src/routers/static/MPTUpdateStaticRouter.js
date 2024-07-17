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
exports.MPTUpdateStaticRouter = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const Router_1 = require("C:/snapshot/project/obj/di/Router");
const MPTUpdateCallbacks_1 = require("../../callbacks/MPTUpdateCallbacks");
let MPTUpdateStaticRouter = class MPTUpdateStaticRouter extends Router_1.StaticRouter {
    mptUpdateCallbacks;
    constructor(mptUpdateCallbacks) {
        super([
            new Router_1.RouteAction("/mpt/update/ping", (url, info, sessionID, output) => {
                return this.mptUpdateCallbacks.handlePing(url, info, sessionID);
            }),
            new Router_1.RouteAction("/mpt/update/spawnpoint", (url, info, sessionID, output) => {
                return this.mptUpdateCallbacks.handleSpawnpoint(url, info, sessionID);
            }),
            new Router_1.RouteAction("/mpt/update/playerspawn", (url, info, sessionID, output) => {
                return this.mptUpdateCallbacks.handlePlayerspawn(url, info, sessionID);
            }),
            new Router_1.RouteAction("/mpt/update/sethost", (url, info, sessionID, output) => {
                return this.mptUpdateCallbacks.handleSethost(url, info, sessionID);
            }),
            new Router_1.RouteAction("/mpt/update/setstatus", (url, info, sessionID, output) => {
                return this.mptUpdateCallbacks.handleSetStatus(url, info, sessionID);
            })
        ]);
        this.mptUpdateCallbacks = mptUpdateCallbacks;
    }
};
exports.MPTUpdateStaticRouter = MPTUpdateStaticRouter;
exports.MPTUpdateStaticRouter = MPTUpdateStaticRouter = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("MPTUpdateCallbacks")),
    __metadata("design:paramtypes", [typeof (_a = typeof MPTUpdateCallbacks_1.MPTUpdateCallbacks !== "undefined" && MPTUpdateCallbacks_1.MPTUpdateCallbacks) === "function" ? _a : Object])
], MPTUpdateStaticRouter);
//# sourceMappingURL=MPTUpdateStaticRouter.js.map