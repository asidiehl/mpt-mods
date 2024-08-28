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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fika = void 0;
const node_path_1 = __importDefault(require("node:path"));
const tsyringe_1 = require("tsyringe");
const DatabaseServer_1 = require("@spt/servers/DatabaseServer");
const Overrider_1 = require("./overrides/Overrider");
const FikaServerTools_1 = require("./utils/FikaServerTools");
const FikaConfig_1 = require("./utils/FikaConfig");
const FikaDedicatedProfileService_1 = require("./services/dedicated/FikaDedicatedProfileService");
const ImageRouter_1 = require("@spt/routers/ImageRouter");
let Fika = class Fika {
    databaseServer;
    overrider;
    fikaServerTools;
    fikaConfig;
    fikaDedicatedProfileService;
    imageRouter;
    modPath;
    natPunchServerConfig;
    dedicatedConfig;
    backgroundConfig;
    constructor(databaseServer, overrider, fikaServerTools, fikaConfig, fikaDedicatedProfileService, imageRouter) {
        this.databaseServer = databaseServer;
        this.overrider = overrider;
        this.fikaServerTools = fikaServerTools;
        this.fikaConfig = fikaConfig;
        this.fikaDedicatedProfileService = fikaDedicatedProfileService;
        this.imageRouter = imageRouter;
        this.modPath = fikaConfig.getModPath();
        this.natPunchServerConfig = fikaConfig.getConfig().natPunchServer;
        this.dedicatedConfig = fikaConfig.getConfig().dedicated;
        this.backgroundConfig = fikaConfig.getConfig().background;
    }
    async preSptLoad(container) {
        await this.overrider.override(container);
    }
    async postSptLoad(container) {
        if (this.natPunchServerConfig.enable) {
            this.fikaServerTools.startService("NatPunchServer");
        }
        if (this.dedicatedConfig.profiles.amount > 0) {
            this.fikaDedicatedProfileService.init();
        }
        if (this.backgroundConfig.enable) {
            const image = this.backgroundConfig.easteregg
                ? "assets/images/launcher/bg-senko.png"
                : "assets/images/launcher/bg.png";
            this.imageRouter.addRoute("/files/launcher/bg", node_path_1.default.join(this.modPath, image));
        }
    }
};
exports.Fika = Fika;
exports.Fika = Fika = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("DatabaseServer")),
    __param(1, (0, tsyringe_1.inject)("Overrider")),
    __param(2, (0, tsyringe_1.inject)("FikaServerTools")),
    __param(3, (0, tsyringe_1.inject)("FikaConfig")),
    __param(4, (0, tsyringe_1.inject)("FikaDedicatedProfileService")),
    __param(5, (0, tsyringe_1.inject)("ImageRouter")),
    __metadata("design:paramtypes", [DatabaseServer_1.DatabaseServer,
        Overrider_1.Overrider,
        FikaServerTools_1.FikaServerTools,
        FikaConfig_1.FikaConfig,
        FikaDedicatedProfileService_1.FikaDedicatedProfileService,
        ImageRouter_1.ImageRouter])
], Fika);
