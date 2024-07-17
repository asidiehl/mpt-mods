"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const config_json_1 = __importDefault(require("../config/config.json"));
class Mod {
    postDBLoad(container) {
        // get database from server
        const databaseServer = container.resolve("DatabaseServer");
        // Import the logger
        container.resolve("WinstonLogger");
        // Get all the in-memory json found in /assets/database
        const tables = databaseServer.getTables();
        // Define logger
        const logger = container.resolve("WinstonLogger");
        // Get config server
        const configServer = container.resolve("ConfigServer");
        // Load location configs
        const locationsConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.LOCATION);
        // List of maps currently in the game
        const maps = ['bigmap', 'factory4_day', 'factory4_night', 'interchange', 'laboratory', 'lighthouse', 'rezervbase', 'sandbox', 'shoreline', 'tarkovstreets', 'woods'];
        logger.logWithColor(`Setting equal item probabilities`, LogTextColor_1.LogTextColor.CYAN);
        // Global looot chance modifier is default to 0.2. Cranking it to 1
        // Isn't doing anything?
        //logger.info(`${tables.globals.config.GlobalLootChanceModifier}`);
        //tables.globals.config.sGlobalLootChanceModifier = 1;
        //logger.info(`${tables.globals.config.GlobalLootChanceModifier}`);
        // Apply multipliers
        if (config_json_1.default.static_loot_multiplier_enabled) {
            for (const mapName in locationsConfig.looseLootMultiplier) {
                let mapStatic = locationsConfig.staticLootMultiplier[mapName];
                //logger.info(`${mapName} ${mapStatic}`);
                mapStatic *= config_json_1.default.static_loot_multiplier;
                //logger.info(`${mapName} ${mapStatic}`);
            }
        }
        if (config_json_1.default.loose_loot_multiplier_enabled) {
            for (const mapName in locationsConfig.looseLootMultiplier) {
                let mapLoose = locationsConfig.looseLootMultiplier[mapName];
                //logger.info(`${mapName} ${mapLoose}`);
                mapLoose *= 3;
                //logger.info(`${mapName} ${mapLoose}`);
            }
        }
        if (config_json_1.default.spawnpoint_probability_enabled) {
            logger.logWithColor(`Modifying Static Loot`, LogTextColor_1.LogTextColor.CYAN);
            // static loot probability
            for (const crates in tables.loot.staticLoot) {
                const crate = tables.loot.staticLoot[crates];
                crate.itemDistribution.forEach(item => item.relativeProbability = 1);
            }
        }
        if (config_json_1.default.item_distribution_enabled) {
            logger.logWithColor(`Modifying Loose Loot`, LogTextColor_1.LogTextColor.CYAN);
            for (const mapName of maps) {
                const map = tables.locations[mapName];
                // The probability per spawnpoints is broken on some maps if this is set to 1 for some reason
                // Dumb fix, set 9 out of every 10 to 1, and the rest to 0.999999999
                const int = "interchange";
                const lig = "lighthouse";
                const facd = "factory4_day";
                const facn = "factory4_night";
                if (mapName == int || mapName == lig || mapName == facd || mapName == facn) {
                    //logger.logWithColor(`BUGFIX: Slightly nerfing looseLoot on ${mapName}`, LogTextColor.CYAN);
                    map.looseLoot.spawnpoints.forEach((spawn, index) => {
                        if (index % 10 === 9) {
                            spawn.probability = 0.999999999;
                        }
                        else {
                            spawn.probability = 1;
                        }
                    });
                }
                else {
                    map.looseLoot.spawnpoints.forEach(spawn => {
                        spawn.probability = 1;
                    });
                }
            }
            // Set probability for each item in the pool to be equal
            for (const mapName of maps) {
                const map = tables.locations[mapName];
                map.looseLoot.spawnpoints.forEach(spawn => {
                    spawn.itemDistribution.forEach(item => item.relativeProbability = 1);
                });
            }
        }
    }
}
module.exports = { mod: new Mod() };
//# sourceMappingURL=mod.js.map