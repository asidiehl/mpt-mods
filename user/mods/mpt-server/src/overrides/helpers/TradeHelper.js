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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeHelperOverride = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const HttpResponseUtil_1 = require("C:/snapshot/project/obj/utils/HttpResponseUtil");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const InventoryHelper_1 = require("C:/snapshot/project/obj/helpers/InventoryHelper");
const FenceService_1 = require("C:/snapshot/project/obj/services/FenceService");
const PaymentService_1 = require("C:/snapshot/project/obj/services/PaymentService");
const HandbookHelper_1 = require("C:/snapshot/project/obj/helpers/HandbookHelper");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const Money_1 = require("C:/snapshot/project/obj/models/enums/Money");
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const Override_1 = require("../../di/Override");
let TradeHelperOverride = class TradeHelperOverride extends Override_1.Override {
    logger;
    httpResponse;
    itemHelper;
    inventoryHelper;
    handbookHelper;
    fenceService;
    paymentService;
    configServer;
    constructor(logger, httpResponse, itemHelper, inventoryHelper, handbookHelper, fenceService, paymentService, configServer) {
        super();
        this.logger = logger;
        this.httpResponse = httpResponse;
        this.itemHelper = itemHelper;
        this.inventoryHelper = inventoryHelper;
        this.handbookHelper = handbookHelper;
        this.fenceService = fenceService;
        this.paymentService = paymentService;
        this.configServer = configServer;
    }
    execute(container) {
        container.afterResolution("TradeHelper", (_t, result) => {
            // Support fence holding player-sold items in assort
            result.sellItem = (profileWithItemsToSell, profileToReceiveMoney, sellRequest, sessionID, output) => {
                // Find item in inventory and remove it
                for (const itemToBeRemoved of sellRequest.items) {
                    // Strip out whitespace
                    const itemIdToFind = itemToBeRemoved.id.replace(/\s+/g, "");
                    // Find item in player inventory, or show error to player if not found
                    const matchingItemInInventory = profileWithItemsToSell.Inventory.items.find((x) => x._id === itemIdToFind);
                    if (!matchingItemInInventory) {
                        const errorMessage = `Unable to sell item ${itemToBeRemoved.id}, cannot be found in player inventory`;
                        this.logger.error(errorMessage);
                        this.httpResponse.appendErrorToOutput(output, errorMessage);
                        return;
                    }
                    this.logger.debug(`Selling: id: ${matchingItemInInventory._id} tpl: ${matchingItemInInventory._tpl}`);
                    // THIS IS THE ONLY CHANGE WE DO IN THIS METHOD!
                    if (sellRequest.tid === Traders_1.Traders.FENCE) {
                        this.addToFence(profileWithItemsToSell.Inventory.items, matchingItemInInventory._id);
                    }
                    // THIS IS THE ONLY CHANGE WE DO IN THIS METHOD!
                    // Also removes children
                    this.inventoryHelper.removeItem(profileWithItemsToSell, itemToBeRemoved.id, sessionID, output);
                }
                // Give player money for sold item(s)
                this.paymentService.giveProfileMoney(profileToReceiveMoney, sellRequest.price, sellRequest, output, sessionID);
            };
        });
    }
    addToFence(itemCollection, itemId) {
        // yes, this is technically a protected class variable, but we can access it here since we don't care.
        const assort = this.fenceService.fenceAssort;
        // Copy the item and its children
        let items = structuredClone(this.itemHelper.findAndReturnChildrenAsItems(itemCollection, itemId));
        const root = items[0];
        const traderConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        const cost = this.handbookHelper.getTemplatePriceForItems(items) * traderConfig.fence.itemPriceMult;
        // Fix IDs
        items = this.itemHelper.reparentItemAndChildren(root, items);
        root.parentId = "hideout";
        // Clean up the items
        delete root.location;
        for (const item of items) {
            if (item.parentId == "hideout") {
                continue;
            }
            delete item.upd;
        }
        // Add the item to fence's assortment
        assort.items.push(...items);
        assort.barter_scheme[root._id] = [
            [
                {
                    count: cost,
                    _tpl: Money_1.Money.ROUBLES
                }
            ]
        ];
        assort.loyal_level_items[root._id] = 1;
    }
};
exports.TradeHelperOverride = TradeHelperOverride;
exports.TradeHelperOverride = TradeHelperOverride = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("HttpResponseUtil")),
    __param(2, (0, tsyringe_1.inject)("ItemHelper")),
    __param(3, (0, tsyringe_1.inject)("InventoryHelper")),
    __param(4, (0, tsyringe_1.inject)("HandbookHelper")),
    __param(5, (0, tsyringe_1.inject)("FenceService")),
    __param(6, (0, tsyringe_1.inject)("PaymentService")),
    __param(7, (0, tsyringe_1.inject)("ConfigServer")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof HttpResponseUtil_1.HttpResponseUtil !== "undefined" && HttpResponseUtil_1.HttpResponseUtil) === "function" ? _b : Object, typeof (_c = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _c : Object, typeof (_d = typeof InventoryHelper_1.InventoryHelper !== "undefined" && InventoryHelper_1.InventoryHelper) === "function" ? _d : Object, typeof (_e = typeof HandbookHelper_1.HandbookHelper !== "undefined" && HandbookHelper_1.HandbookHelper) === "function" ? _e : Object, typeof (_f = typeof FenceService_1.FenceService !== "undefined" && FenceService_1.FenceService) === "function" ? _f : Object, typeof (_g = typeof PaymentService_1.PaymentService !== "undefined" && PaymentService_1.PaymentService) === "function" ? _g : Object, typeof (_h = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _h : Object])
], TradeHelperOverride);
//# sourceMappingURL=TradeHelper.js.map