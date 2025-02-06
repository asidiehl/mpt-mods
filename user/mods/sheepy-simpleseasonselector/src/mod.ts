import path from "node:path";
import type { DependencyContainer } from "tsyringe";
import type { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import type { VFS } from "@spt/utils/VFS";
import type { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { jsonc } from "jsonc";
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import type { IWeatherConfig } from "@spt/models/spt/config/IWeatherConfig";
import type { IPostSptLoadMod } from "@spt/models/external/IPostSptLoadMod";
import type { Season } from "@spt/models/enums/Season";
import type { ISeasonalEventConfig } from "@spt/models/spt/config/ISeasonalEventConfig";
import type { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";

class Mod implements IPostDBLoadMod,IPostSptLoadMod,IPreSptLoadMod
{

    private modName = "[Simple Season Selector]"
    
    private seasonsArray = ["Summer","Autumn","Winter","Spring","Late Autumn","Early Spring","Storm"] // seasons array
    /*
    SUMMER = 0,
    AUTUMN = 1,
    WINTER = 2,
    SPRING = 3,
    AUTUMN_LATE = 4,
    SPRING_EARLY = 5,
    STORM = 6
    */

    private finalSelectedSeason: Season

    public preSptLoad(container: DependencyContainer): void 
    {
        const vfs = container.resolve<VFS>("VFS");
        const modConfigJsonC = jsonc.parse(vfs.readFile(path.resolve(__dirname, "../config/config.jsonc")));
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const weatherConfig : IWeatherConfig = configServer.getConfig(ConfigTypes.WEATHER);
        const seasonalEventConfig: ISeasonalEventConfig = configServer.getConfig(ConfigTypes.SEASONAL_EVENT)

        // Saving Christmas by breaking spacetime and adding a 13th season to the year

        const saveChristmas:boolean = modConfigJsonC.SaveChristmas // grabbing the config
        
        if (saveChristmas === true) 
        {
            weatherConfig.seasonDates[3].endDay = 1
            weatherConfig.seasonDates[3].endMonth = 13
                
            seasonalEventConfig.events[1].endDay = 1
            seasonalEventConfig.events[1].endMonth = 13
        }        
    }

    public postDBLoad(container: DependencyContainer): void 
    {
        // code graciously provided by AcidPhantasm
        const vfs = container.resolve<VFS>("VFS");
        const modConfigJsonC = jsonc.parse(vfs.readFile(path.resolve(__dirname, "../config/config.jsonc")));
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const weatherConfig : IWeatherConfig = configServer.getConfig(ConfigTypes.WEATHER);
        const logger = container.resolve<ILogger>("WinstonLogger");
       
        weatherConfig.overrideSeason = null // preinitialises the season to null just in case the user edited their weather.json

        const selectedSeason = modConfigJsonC.SelectedSeason // pulling the value from config

        // setting the season in the db

        if (selectedSeason === -1) 
        {
            logger.success(`${this.modName} Selected Season: Auto`) // yes, Auto is just null wearing a fancy hat
            //its job here is done, as the db value is preinitialised to null already
            //no, im not checking if they spelt "auto" instead. it will default itself to null in that case anyway
        }
        else if (selectedSeason < 7) 
        { // if the config value is both a number and can be one of the seasons
            weatherConfig.overrideSeason = selectedSeason // slap the config value into the db
            logger.success(`${this.modName} Selected Season: ${this.seasonsArray[selectedSeason]}`) // report back a user readable season name from the seasonsArray
        } 
        else 
        {
            logger.warning(`${this.modName} Invalid config value: ${selectedSeason}. Defaulting to Auto`) // the perks of being a Helper is kinda knowing what issues people will have
        }

        // logger.success(`${this.modName} overrideSeason = ${weatherConfig.overrideSeason}`) //debug

        this.finalSelectedSeason = weatherConfig.overrideSeason // keeping track of what value we all agreed the overrideSeason should be
        
    }

    public postSptLoad(container: DependencyContainer): void 
    {
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const weatherConfig : IWeatherConfig = configServer.getConfig(ConfigTypes.WEATHER);
        const logger = container.resolve<ILogger>("WinstonLogger");

        if (this.finalSelectedSeason !== weatherConfig.overrideSeason) // if another mod changed the value that we all agreed on
        {
            if (weatherConfig.overrideSeason === null) // if another mod set the value to null
            { 
                logger.warning(`${this.modName} Another mod has overridden the selected season. Current season: Auto. Check your load order.`) 
            } 
            else if (weatherConfig.overrideSeason < 7) // if another mod set the value to a different season
            {
                logger.warning(`${this.modName} Another mod has overridden the selected season. Current season: ${this.seasonsArray[weatherConfig.overrideSeason]}. Check your load order.`) 
            }
            else // another mod set the value to something that doesn't make sense
            {
                logger.warning(`${this.modName} Another mod has overridden the selected season to an invalid value: ${weatherConfig.overrideSeason}. Check your load order.`) 
            } // granted, it will not be able to detect if another mod set the value to the same one that SSS did, but there's only so much we can do
        }
    }
}

export const mod = new Mod();
