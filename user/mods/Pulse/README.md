# Pulse - Bot Wave Generator for SPT

**Pulse** is a customizable bot wave generator mod for Single Player Tarkov (SPT) that enhances your raid experience by controlling bot spawning behavior, group sizes, and raid dynamics.

## Features

- **Customizable PMC Group Sizes** - Control the maximum size of PMC groups
- **PMC/Scav Ratio Control** - Set the percentage of PMCs vs Scavs per assault wave
- **Scav Wave Configuration** - Adjust scav group sizes and spawn patterns
- **Bot Count Multipliers** - Scale bot populations with configurable min/max multipliers
- **Per-Map Bot Limits** - Set individual bot limits for each map with user-friendly names
- **Global Bot Limit** - Set a universal fallback cap on maximum bot count
- **Assault Wave Control** - Set the number of assault waves per raid
- **Boss Spawn Control** - Adjust boss spawn chances with percentage multiplier
- **PMC Difficulty Settings** - Choose PMC bot difficulty levels
- **Debug Mode** - Enable detailed logging for troubleshooting

## Installation

1. Download the latest release
2. Extract the `Pulse` folder to your `SPT/user/mods/` directory
3. Configure settings in `config/config.json` (optional)
4. Launch SPT and enjoy!

## Configuration

Edit `config/config.json` to customize your experience:

```json
{
  "MaxPmcGroupSize": 3,
  "MaxScavGroupSize": 3,
  "PmcBotDifficulty": "normal",
  "AssaultWaveCount": 3,
  "BotCountMultiplierMin": 1.5,
  "BotCountMultiplierMax": 2.0,
  "GlobalBotLimit": 0,
  "MapBotLimits": {
    "Customs": 19,
    "Factory Day": 20,
    "Factory Night": 22,
    "Interchange": 30,
    "Laboratory": 25,
    "Lighthouse": 29,
    "Reserve": 28,
    "Shoreline": 31,
    "Streets of Tarkov": 48,
    "Labyrinth": 30,
    "Woods": 30,
    "Ground Zero": 20,
    "Ground Zero High": 24
  },
  "PmcPercentage": 33.0,
  "BossSpawnChancePercent": 100.0,
  "Debug": false
}
```

### Configuration Options

#### Basic Settings

- **MaxPmcGroupSize**: Maximum PMCs per group (default: 3)
- **MaxScavGroupSize**: Maximum Scavs per group (default: 3)
- **PmcBotDifficulty**: PMC difficulty - "easy", "normal", "hard", or "impossible" (default: "normal")
- **AssaultWaveCount**: Number of assault waves per raid (default: 3)
- **BotCountMultiplierMin**: Minimum bot count multiplier applied to base bot counts (default: 1.5)
- **BotCountMultiplierMax**: Maximum bot count multiplier applied to base bot counts (default: 2.0)
- **PmcPercentage**: Percentage of total bots that should be PMCs vs Scavs. 33.0 = 1/3 PMCs and 2/3 Scavs, 50.0 = equal split, 75.0 = mostly PMCs (default: 33.0)
- **BossSpawnChancePercent**: Boss spawn chance percentage. 100.0 = normal spawn chances, 50.0 = half the chance, 200.0 = double the chance (default: 100.0)
- **Debug**: Enable debug logging (default: false)

#### Bot Limit Settings

**How Bot Limits Work:**
1. The mod first applies a random multiplier (between `BotCountMultiplierMin` and `BotCountMultiplierMax`) to each map's base bot count
2. Then it applies the bot limit cap if the multiplied value exceeds the limit
3. Per-map limits are checked first, then falls back to `GlobalBotLimit` if no per-map limit is set

**Important:** The bot limit acts as a **maximum cap** that overrides the multiplier.

Example with Customs (base count: 19, multiplier: 1.5-2.0):
- If `"Customs": 19` → You get **19 bots max** (multiplier tries to give 28-38, but limit caps it at 19)
- If `"Customs": 38` → You get **28-38 bots** (multiplier result of 28-38 fits within the limit)
- If `"Customs": 0` → You get **28-38 bots** (no limit, multiplier applies freely)

**GlobalBotLimit**: Universal fallback bot limit for all maps. Used when a specific map doesn't have a limit set or has a limit of 0. Set to 0 to disable the global limit (default: 0)

**MapBotLimits**: Individual bot limits for each map using user-friendly names. Set a map to 0 to use only the multiplier without a hard cap. Default values are based on vanilla SPT bot counts:

| Map Name | Default Limit | Description |
|----------|---------------|-------------|
| Customs | 19 | Popular mid-size map |
| Factory Day | 20 | Small close-quarters map (daytime) |
| Factory Night | 22 | Small close-quarters map (nighttime) |
| Interchange | 30 | Large indoor shopping mall |
| Laboratory | 25 | Underground facility |
| Lighthouse | 29 | Coastal area with lighthouse |
| Reserve | 28 | Military base |
| Shoreline | 31 | Large coastal map with resort |
| Streets of Tarkov | 48 | Largest map - urban streets |
| Labyrinth | 30 | Underground maze beneath Streets |
| Woods | 30 | Large forested area |
| Ground Zero | 20 | Small urban area |
| Ground Zero High | 24 | Ground Zero with higher bot count |

**Example Bot Limit Configurations:**

```json
// Allow unlimited bots on Customs (only multiplier applies)
"MapBotLimits": {
  "Customs": 0
}

// Cap Streets of Tarkov at 60 bots maximum
"MapBotLimits": {
  "Streets of Tarkov": 60
}

// Reduce Factory to 15 bots for a more manageable experience
"MapBotLimits": {
  "Factory Day": 15,
  "Factory Night": 15
}
```

## Credits

**Pulse** is a customized fork of [Unda](https://github.com/barlog-m/spt-unda) by Barlog_M.

## Author

**LumurkFox**

## License

MIT License - See LICENSE file for details

## Links

- GitHub: https://github.com/lumurkfox/spt-pulse
- Original Unda Mod: https://github.com/barlog-m/spt-unda

## Version

1.0.2 - Compatible with SPT 4.0.x
