"use strict";
// Copyright (C) 2023 Platinum
// 
// This file is part of spt-the-blacklist.
// 
// spt-the-blacklist is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// spt-the-blacklist is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with spt-the-blacklist.  If not, see <http://www.gnu.org/licenses/>.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonc_1 = require("C:/snapshot/project/node_modules/jsonc");
const path_1 = __importDefault(require("path"));
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const helpers_1 = require("./helpers");
class TheBlacklistMod {
    logger;
    modName = "[The Blacklist]";
    // We to adjust for pricing using a baseline when mods like SPT Realism are used
    baselineBullet;
    blacklistedItemsUpdatedCount = 0;
    nonBlacklistedItemsUpdatedCount = 0;
    ammoPricesUpdatedCount = 0;
    config;
    advancedConfig;
    async postDBLoadAsync(container) {
        this.logger = container.resolve("WinstonLogger");
        this.config = await jsonc_1.jsonc.read(path_1.default.resolve(__dirname, "../config.jsonc"));
        this.advancedConfig = await jsonc_1.jsonc.read(path_1.default.resolve(__dirname, "../advancedConfig.jsonc"));
        const databaseServer = container.resolve("DatabaseServer");
        const tables = databaseServer.getTables();
        const configServer = container.resolve("ConfigServer");
        const ragfairConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        const itemTable = tables.templates.items;
        const handbookItems = tables.templates.handbook.Items;
        const prices = tables.templates.prices;
        const globals = tables.globals;
        this.baselineBullet = itemTable[this.advancedConfig.baselineBulletId];
        this.updateRagfairConfig(ragfairConfig);
        this.updateGlobals(globals);
        // Find all items to update by looping through handbook which is a better indicator of useable items.
        handbookItems.forEach(handbookItem => {
            const item = itemTable[handbookItem.Id];
            const originalPrice = prices[item._id];
            const customItemConfig = this.config.customItemConfigs.find(conf => conf.itemId === item._id);
            // We found a custom item config override to use. That's all we care about for this item. Move on to the next item.
            if (customItemConfig && this.updateItemUsingCustomItemConfig(customItemConfig, item, prices, originalPrice, ragfairConfig)) {
                return;
            }
            const itemProps = item._props;
            if ((0, helpers_1.isBulletOrShotgunShell)(item)) {
                this.updateAmmoPrice(item, prices);
            }
            if (!itemProps.CanSellOnRagfair) {
                // Some blacklisted items are hard to balance or just shouldn't be allowed so we will keep them blacklisted.
                if (this.advancedConfig.excludedCategories.some(category => category === handbookItem.ParentId)) {
                    ragfairConfig.dynamic.blacklist.custom.push(item._id);
                    this.debug(`Ignored item ${item._id} - ${item._name} because we are excluding handbook category ${handbookItem.ParentId}.`);
                    return;
                }
                prices[item._id] = this.getUpdatedPrice(handbookItem, item, prices);
                if (!prices[item._id]) {
                    this.debug(`There are no flea prices for ${item._id} - ${item._name}!`);
                    return;
                }
                if (!isNaN(customItemConfig?.priceMultiplier)) {
                    prices[item._id] *= customItemConfig.priceMultiplier;
                }
                this.debug(`Updated ${item._id} - ${item._name} flea price from ${originalPrice} to ${prices[item._id]}.`);
                this.blacklistedItemsUpdatedCount++;
            }
        });
        this.logger.success(`${this.modName}: Success! Found ${this.blacklistedItemsUpdatedCount} blacklisted & ${this.nonBlacklistedItemsUpdatedCount} non-blacklisted items to update.`);
        if (this.config.useBalancedPricingForAllAmmo) {
            this.logger.success(`${this.modName}: config.useBalancedPricingForAllAmmo is enabled! Updated ${this.ammoPricesUpdatedCount} ammo prices.`);
        }
    }
    updateRagfairConfig(ragfairConfig) {
        ragfairConfig.dynamic.blacklist.enableBsgList = !this.config.disableBsgBlacklist;
        if (this.advancedConfig.useTraderPriceForOffersIfHigher != null) {
            ragfairConfig.dynamic.useTraderPriceForOffersIfHigher = !!this.advancedConfig.useTraderPriceForOffersIfHigher;
        }
        if (this.config.enableFasterSales && !isNaN(this.advancedConfig.runIntervalSecondsOverride)) {
            ragfairConfig.runIntervalValues.outOfRaid = this.advancedConfig.runIntervalSecondsOverride;
        }
        if (this.config.enableScarceOffers) {
            this.updateRagfairConfigToHaveScarceOffers(ragfairConfig);
        }
    }
    updateRagfairConfigToHaveScarceOffers(ragfairConfig) {
        const minMaxPropertiesToOverride = ["offerItemCount", "stackablePercent", "nonStackableCount"];
        for (const propertyToOverride of minMaxPropertiesToOverride) {
            ragfairConfig.dynamic[propertyToOverride].max = this.advancedConfig[`${propertyToOverride}Override`].max;
            ragfairConfig.dynamic[propertyToOverride].min = this.advancedConfig[`${propertyToOverride}Override`].min;
        }
        ragfairConfig.dynamic.barter.chancePercent = 0;
        ragfairConfig.dynamic.pack.chancePercent = 0;
    }
    updateGlobals(globals) {
        const ragfairConfig = globals.config.RagFair;
        if (this.config.addExtraOfferSlot) {
            for (const settingForBracket of ragfairConfig.maxActiveOfferCount) {
                settingForBracket.count += this.advancedConfig.extraOfferSlotsToAdd;
            }
        }
    }
    // Returns true if we updated something using the customItemConfig so we can skip to the next handbook item.
    updateItemUsingCustomItemConfig(customItemConfig, item, prices, originalPrice, ragfairConfig) {
        if (customItemConfig?.blacklisted) {
            this.debug(`Blacklisted item ${item._id} - ${item._name} due to its customItemConfig.`);
            ragfairConfig.dynamic.blacklist.custom.push(item._id);
            if (item._props.CanSellOnRagfair) {
                this.nonBlacklistedItemsUpdatedCount++;
            }
            return true;
        }
        if (customItemConfig?.fleaPriceOverride) {
            prices[item._id] = customItemConfig.fleaPriceOverride;
            this.debug(`Updated ${item._id} - ${item._name} flea price from ${originalPrice} to ${prices[item._id]} (price override).`);
            if (item._props.CanSellOnRagfair) {
                this.nonBlacklistedItemsUpdatedCount++;
            }
            return true;
        }
        return false;
    }
    updateAmmoPrice(item, prices) {
        const itemProps = item._props;
        // We don't care about this standard ammo item if we haven't enabled useBalancedPricingForAllAmmo
        if (itemProps.CanSellOnRagfair && !this.config.useBalancedPricingForAllAmmo) {
            return;
        }
        const newPrice = this.getUpdatedAmmoPrice(item);
        prices[item._id] = newPrice;
        if (!itemProps.CanSellOnRagfair) {
            this.blacklistedItemsUpdatedCount++;
        }
        else {
            this.nonBlacklistedItemsUpdatedCount++;
        }
        this.ammoPricesUpdatedCount++;
    }
    getUpdatedAmmoPrice(item) {
        const baselinePen = this.baselineBullet._props.PenetrationPower;
        const baselineDamage = this.baselineBullet._props.Damage;
        const basePenetrationMultiplier = item._props.PenetrationPower / baselinePen;
        const baseDamageMultiplier = item._props.Damage / baselineDamage;
        let penetrationMultiplier;
        // We are checking for > 0.99 because we want the baseline bullet (mult of 1) to be close to its baseline price.
        if (basePenetrationMultiplier > 0.99) {
            // A good gradient to make higher power rounds more expensive
            penetrationMultiplier = 3 * basePenetrationMultiplier - 2;
        }
        else {
            // The baseline ammo is mid tier with a reasonable 1000 rouble each. Ammo weaker than this tend to be pretty crap so we'll make it much cheaper
            const newMultiplier = basePenetrationMultiplier * 0.7;
            penetrationMultiplier = newMultiplier < 0.1 ? 0.1 : newMultiplier;
        }
        // Reduces the effect of the damage multiplier so high DMG rounds aren't super expensive.
        // Eg. let baseDamageMultiplier = 2 & bulletDamageMultiplierRedutionFactor = 0.7. Instead of a 2x price when a bullet is 2x damage, we instead get:
        // 2 + (1 - 2) * 0.7 = 2 - 0.7 = 1.3x the price.
        const damageMultiplier = baseDamageMultiplier + (1 - baseDamageMultiplier) * this.advancedConfig.bulletDamageMultiplierRedutionFactor;
        return this.advancedConfig.baselineBulletPrice * penetrationMultiplier * damageMultiplier * this.config.blacklistedAmmoAdditionalPriceMultiplier;
    }
    getUpdatedPrice(handbookItem, item, prices) {
        // If a flea price doesn't exist for an item, we can multiply its handbook price which usually exists.
        if (prices[item._id] == null) {
            const handbookPrice = handbookItem.Price;
            return handbookPrice * this.advancedConfig.handbookPriceMultiplier;
        }
        return prices[item._id] * this.config.blacklistedItemPriceMultiplier;
    }
    debug(message) {
        if (this.advancedConfig.enableDebug) {
            this.logger.debug(`${this.modName}: ${message}`);
        }
    }
}
module.exports = { mod: new TheBlacklistMod() };
//# sourceMappingURL=mod.js.map