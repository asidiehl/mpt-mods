import path from "node:path";
import type { DependencyContainer } from "tsyringe";
import type { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { FileSystemSync } from "@spt/utils/FileSystemSync";
import type { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { jsonc } from "jsonc";
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import type { IWeatherConfig } from "@spt/models/spt/config/IWeatherConfig";

class Mod implements IPostDBLoadMod
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


    public postDBLoad(container: DependencyContainer): void 
    {
        // code graciously provided by AcidPhantasm
        const fileSystem = container.resolve<FileSystemSync>("FileSystemSync");
        const modConfigJsonC = jsonc.parse(fileSystem.read(path.resolve(__dirname, "../config/config.jsonc")));
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
        
    }
}

export const mod = new Mod();
