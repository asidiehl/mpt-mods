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
exports.MPTClientStaticRouter = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const Router_1 = require("C:/snapshot/project/obj/di/Router");
const MPTClientCallbacks_1 = require("../../callbacks/MPTClientCallbacks");
let MPTClientStaticRouter = class MPTClientStaticRouter extends Router_1.StaticRouter {
    mptClientCallbacks;
    constructor(mptClientCallbacks) {
        super([
            new Router_1.RouteAction("/mpt/client/config", (url, info, sessionID, output) => {
                return this.mptClientCallbacks.handleClientConfig(url, info, sessionID);
            })
        ]);
        this.mptClientCallbacks = mptClientCallbacks;
    }
};
exports.MPTClientStaticRouter = MPTClientStaticRouter;
exports.MPTClientStaticRouter = MPTClientStaticRouter = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("MPTClientCallbacks")),
    __metadata("design:paramtypes", [typeof (_a = typeof MPTClientCallbacks_1.MPTClientCallbacks !== "undefined" && MPTClientCallbacks_1.MPTClientCallbacks) === "function" ? _a : Object])
], MPTClientStaticRouter);
//# sourceMappingURL=MPTClientStaticRouter.js.map