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
exports.MPTSendItemStaticRouter = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const Router_1 = require("C:/snapshot/project/obj/di/Router");
const MPTSendItemCallbacks_1 = require("../../callbacks/MPTSendItemCallbacks");
let MPTSendItemStaticRouter = class MPTSendItemStaticRouter extends Router_1.StaticRouter {
    mptSendItemCallbacks;
    constructor(mptSendItemCallbacks) {
        super([
            new Router_1.RouteAction("/mpt/senditem/availablereceivers", (url, info, sessionID, output) => {
                return this.mptSendItemCallbacks.handleAvailableReceivers(url, info, sessionID);
            })
        ]);
        this.mptSendItemCallbacks = mptSendItemCallbacks;
    }
};
exports.MPTSendItemStaticRouter = MPTSendItemStaticRouter;
exports.MPTSendItemStaticRouter = MPTSendItemStaticRouter = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("MPTSendItemCallbacks")),
    __metadata("design:paramtypes", [typeof (_a = typeof MPTSendItemCallbacks_1.MPTSendItemCallbacks !== "undefined" && MPTSendItemCallbacks_1.MPTSendItemCallbacks) === "function" ? _a : Object])
], MPTSendItemStaticRouter);
//# sourceMappingURL=MPTSendItemStaticRouter.js.map