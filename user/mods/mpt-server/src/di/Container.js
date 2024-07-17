"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const MPTConfig_1 = require("../utils/MPTConfig");
const ProfileCallbacks_1 = require("../overrides/callbacks/ProfileCallbacks");
const LocationCallbacks_1 = require("../overrides/callbacks/LocationCallbacks");
const HttpRouter_1 = require("../overrides/routers/HttpRouter");
const TradeHelper_1 = require("../overrides/helpers/TradeHelper");
const LauncherBackground_1 = require("../overrides/other/LauncherBackground");
const Locales_1 = require("../overrides/other/Locales");
const Overrider_1 = require("../overrides/Overrider");
const MPTMatchService_1 = require("../services/MPTMatchService");
const MPTClientController_1 = require("../controllers/MPTClientController");
const MPTLocationController_1 = require("../controllers/MPTLocationController");
const MPTRaidController_1 = require("../controllers/MPTRaidController");
const MPTSendItemController_1 = require("../controllers/MPTSendItemController");
const MPTUpdateController_1 = require("../controllers/MPTUpdateController");
const MPTClientCallbacks_1 = require("../callbacks/MPTClientCallbacks");
const MPTLocationCallbacks_1 = require("../callbacks/MPTLocationCallbacks");
const MPTRaidCallbacks_1 = require("../callbacks/MPTRaidCallbacks");
const MPTSendItemCallbacks_1 = require("../callbacks/MPTSendItemCallbacks");
const MPTUpdateCallbacks_1 = require("../callbacks/MPTUpdateCallbacks");
const MPTClientStaticRouter_1 = require("../routers/static/MPTClientStaticRouter");
const MPTLocationStaticRouter_1 = require("../routers/static/MPTLocationStaticRouter");
const MPTRaidStaticRouter_1 = require("../routers/static/MPTRaidStaticRouter");
const MPTSendItemStaticRouter_1 = require("../routers/static/MPTSendItemStaticRouter");
const MPTUpdateStaticRouter_1 = require("../routers/static/MPTUpdateStaticRouter");
const MPTItemEventRouter_1 = require("../routers/item_events/MPTItemEventRouter");
const MPT_1 = require("../MPT");
class Container {
    static register(container) {
        this.registerUtils(container);
        this.registerOverrides(container);
        this.registerServices(container);
        this.registerControllers(container);
        this.registerCallbacks(container);
        this.registerRouters(container);
        this.registerListTypes(container);
        container.register("MPT", MPT_1.MPT, { lifecycle: tsyringe_1.Lifecycle.Singleton });
    }
    static registerListTypes(container) {
        container.registerType("Overrides", "ProfileCallbacksOverride");
        container.registerType("Overrides", "LocationCallbacksOverride");
        container.registerType("Overrides", "HttpRouterOverride");
        container.registerType("Overrides", "TradeHelperOverride");
        container.registerType("Overrides", "LauncherBackgroundOverride");
        container.registerType("Overrides", "LocalesOverride");
        container.registerType("StaticRoutes", "MPTClientStaticRouter");
        container.registerType("StaticRoutes", "MPTLocationStaticRouter");
        container.registerType("StaticRoutes", "MPTRaidStaticRouter");
        container.registerType("StaticRoutes", "MPTSendItemStaticRouter");
        container.registerType("StaticRoutes", "MPTUpdateStaticRouter");
        container.registerType("IERouters", "MPTItemEventRouter");
    }
    static registerUtils(container) {
        container.register("MPTConfig", MPTConfig_1.MPTConfig, { lifecycle: tsyringe_1.Lifecycle.Singleton });
    }
    static registerOverrides(container) {
        container.register("ProfileCallbacksOverride", ProfileCallbacks_1.ProfileCallbacksOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("LocationCallbacksOverride", LocationCallbacks_1.LocationCallbacksOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("HttpRouterOverride", HttpRouter_1.HttpRouterOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("TradeHelperOverride", TradeHelper_1.TradeHelperOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("LauncherBackgroundOverride", LauncherBackground_1.LauncherBackgroundOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("LocalesOverride", Locales_1.LocalesOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("Overrider", Overrider_1.Overrider, { lifecycle: tsyringe_1.Lifecycle.Singleton });
    }
    static registerServices(container) {
        container.register("MPTMatchService", MPTMatchService_1.MPTMatchService, { lifecycle: tsyringe_1.Lifecycle.Singleton });
    }
    static registerControllers(container) {
        container.register("MPTClientController", { useClass: MPTClientController_1.MPTClientController });
        container.register("MPTLocationController", { useClass: MPTLocationController_1.MPTLocationController });
        container.register("MPTRaidController", { useClass: MPTRaidController_1.MPTRaidController });
        container.register("MPTSendItemController", { useClass: MPTSendItemController_1.MPTSendItemController });
        container.register("MPTUpdateController", { useClass: MPTUpdateController_1.MPTUpdateController });
    }
    static registerCallbacks(container) {
        container.register("MPTClientCallbacks", { useClass: MPTClientCallbacks_1.MPTClientCallbacks });
        container.register("MPTLocationCallbacks", { useClass: MPTLocationCallbacks_1.MPTLocationCallbacks });
        container.register("MPTRaidCallbacks", { useClass: MPTRaidCallbacks_1.MPTRaidCallbacks });
        container.register("MPTSendItemCallbacks", { useClass: MPTSendItemCallbacks_1.MPTSendItemCallbacks });
        container.register("MPTUpdateCallbacks", { useClass: MPTUpdateCallbacks_1.MPTUpdateCallbacks });
    }
    static registerRouters(container) {
        container.register("MPTClientStaticRouter", { useClass: MPTClientStaticRouter_1.MPTClientStaticRouter });
        container.register("MPTLocationStaticRouter", { useClass: MPTLocationStaticRouter_1.MPTLocationStaticRouter });
        container.register("MPTRaidStaticRouter", { useClass: MPTRaidStaticRouter_1.MPTRaidStaticRouter });
        container.register("MPTSendItemStaticRouter", { useClass: MPTSendItemStaticRouter_1.MPTSendItemStaticRouter });
        container.register("MPTUpdateStaticRouter", { useClass: MPTUpdateStaticRouter_1.MPTUpdateStaticRouter });
        container.register("MPTItemEventRouter", { useClass: MPTItemEventRouter_1.MPTItemEventRouter });
    }
}
exports.Container = Container;
//# sourceMappingURL=Container.js.map