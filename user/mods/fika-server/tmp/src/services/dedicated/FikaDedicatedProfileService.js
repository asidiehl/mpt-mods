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
exports.FikaDedicatedProfileService = void 0;
const tsyringe_1 = require("tsyringe");
const LauncherController_1 = require("@spt/controllers/LauncherController");
const SaveServer_1 = require("@spt/servers/SaveServer");
const TimeUtil_1 = require("@spt/utils/TimeUtil");
const RandomUtil_1 = require("@spt/utils/RandomUtil");
const HashUtil_1 = require("@spt/utils/HashUtil");
const ProfileController_1 = require("@spt/controllers/ProfileController");
const FikaConfig_1 = require("../../utils/FikaConfig");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ConfigServer_1 = require("@spt/servers/ConfigServer");
const ConfigTypes_1 = require("@spt/models/enums/ConfigTypes");
let FikaDedicatedProfileService = class FikaDedicatedProfileService {
    launcherController;
    saveServer;
    logger;
    timeUtil;
    randomUtil;
    hashUtil;
    profileController;
    fikaConfig;
    configServer;
    scriptsPath = path_1.default.join(__dirname, "../../../assets/scripts");
    HEAD_USEC_4 = "5fdb4139e4ed5b5ea251e4ed"; // _parent: 5cc085e214c02e000c6bea67
    VOICE_USEC_4 = "6284d6a28e4092597733b7a6"; // _parent: 5fc100cf95572123ae738483
    httpConfig;
    dedicatedConfig;
    dedicatedProfiles = [];
    constructor(launcherController, saveServer, logger, timeUtil, randomUtil, hashUtil, profileController, fikaConfig, configServer) {
        this.launcherController = launcherController;
        this.saveServer = saveServer;
        this.logger = logger;
        this.timeUtil = timeUtil;
        this.randomUtil = randomUtil;
        this.hashUtil = hashUtil;
        this.profileController = profileController;
        this.fikaConfig = fikaConfig;
        this.configServer = configServer;
        this.dedicatedConfig = fikaConfig.getConfig().dedicated;
        this.httpConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.HTTP);
    }
    init() {
        this.dedicatedProfiles = this.loadDedicatedProfiles();
        this.logger.info(`Found ${this.dedicatedProfiles.length} dedicated client profiles.`);
        const profileAmount = this.dedicatedConfig.profiles.amount;
        if (this.dedicatedProfiles.length < profileAmount) {
            const createdProfiles = this.createDedicatedProfiles(profileAmount);
            this.logger.success(`Created ${createdProfiles.length} dedicated client profiles!`);
            if (this.dedicatedConfig.scripts.generate) {
                let ip = this.httpConfig.ip;
                const port = this.httpConfig.port;
                const forceIp = this.dedicatedConfig.scripts.forceIp;
                if (forceIp != "") {
                    ip = forceIp;
                }
                if (ip == "0.0.0.0") {
                    ip = "127.0.0.1";
                }
                const backendUrl = `http://${ip}:${port}`;
                for (const profile of createdProfiles) {
                    this.generateLaunchScript(profile, backendUrl, this.scriptsPath);
                }
            }
        }
    }
    loadDedicatedProfiles() {
        let profiles = [];
        for (const profileId in this.saveServer.getProfiles()) {
            const profile = this.saveServer.getProfile(profileId);
            if (profile.info.password == "fika-dedicated") {
                profiles.push(profile);
            }
        }
        return profiles;
    }
    createDedicatedProfiles(profileAmount) {
        let profileCount = this.dedicatedProfiles.length;
        let profileAmountToCreate = profileAmount - profileCount;
        let createdProfiles = [];
        for (let i = 0; i < profileAmountToCreate; i++) {
            const profile = this.createDedicatedProfile();
            createdProfiles.push(profile);
        }
        return createdProfiles;
    }
    createDedicatedProfile() {
        // Generate a unique username
        const username = `dedicated_${this.generateUniqueId()}`;
        // Using a password allows us to know which profiles are dedicated client profiles.
        const password = "fika-dedicated";
        // Random edition. Doesn't matter
        const edition = "Edge Of Darkness";
        // Create mini profile
        const profileId = this.createMiniProfile(username, password, edition);
        // Random character configs. Doesn't matter.
        const newProfileData = {
            side: "usec",
            nickname: username, // Use the username as the nickname to ensure it is unique.
            headId: this.HEAD_USEC_4,
            voiceId: this.VOICE_USEC_4,
        };
        const profile = this.createFullProfile(newProfileData, profileId);
        return profile;
    }
    createMiniProfile(username, password, edition) {
        const profileId = this.generateUniqueId();
        const scavId = this.generateUniqueId();
        const newProfileDetails = {
            id: profileId,
            scavId: scavId,
            aid: this.hashUtil.generateAccountId(),
            username: username,
            password: password,
            wipe: true,
            edition: edition,
        };
        this.saveServer.createProfile(newProfileDetails);
        this.saveServer.loadProfile(profileId);
        this.saveServer.saveProfile(profileId);
        return profileId;
    }
    createFullProfile(profileData, profileId) {
        this.profileController.createProfile(profileData, profileId);
        const profile = this.saveServer.getProfile(profileId);
        return profile;
    }
    generateLaunchScript(profile, backendUrl, targetFolderPath) {
        const scriptName = `Start_${profile.info.username}.bat`;
        const scriptPath = path_1.default.join(targetFolderPath, scriptName);
        const scriptContent = `@echo off
if NOT EXIST ".\\BepInEx\\plugins\\Fika.Dedicated.dll" (
    echo Could not find 'Fika.Dedicated.dll', please install the dedicated plugin before starting the client.
    pause
) else (
    start "" EscapeFromTarkov.exe -token=${profile.info.id} -config={"BackendUrl":"${backendUrl}","Version":"live"} -batchmode -nographics --enable-console true & exit
)`;
        try {
            if (!fs_1.default.existsSync(targetFolderPath)) {
                fs_1.default.mkdirSync(targetFolderPath);
            }
            fs_1.default.writeFileSync(scriptPath, scriptContent);
            this.logger.success(`Generated launch script: /fika-server/assets/scripts/${scriptName}`);
        }
        catch (error) {
            this.logger.error(`Failed to generate launch script: ${error}`);
        }
    }
    // generateProfileId
    generateUniqueId() {
        const timestamp = this.timeUtil.getTimestamp();
        return this.formatID(timestamp, timestamp * this.randomUtil.getInt(1, 1000000));
    }
    formatID(timeStamp, counter) {
        const timeStampStr = timeStamp.toString(16).padStart(8, "0");
        const counterStr = counter.toString(16).padStart(16, "0");
        return timeStampStr.toLowerCase() + counterStr.toLowerCase();
    }
};
exports.FikaDedicatedProfileService = FikaDedicatedProfileService;
exports.FikaDedicatedProfileService = FikaDedicatedProfileService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("LauncherController")),
    __param(1, (0, tsyringe_1.inject)("SaveServer")),
    __param(2, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(3, (0, tsyringe_1.inject)("TimeUtil")),
    __param(4, (0, tsyringe_1.inject)("RandomUtil")),
    __param(5, (0, tsyringe_1.inject)("HashUtil")),
    __param(6, (0, tsyringe_1.inject)("ProfileController")),
    __param(7, (0, tsyringe_1.inject)("FikaConfig")),
    __param(8, (0, tsyringe_1.inject)("ConfigServer")),
    __metadata("design:paramtypes", [LauncherController_1.LauncherController,
        SaveServer_1.SaveServer, Object, TimeUtil_1.TimeUtil,
        RandomUtil_1.RandomUtil,
        HashUtil_1.HashUtil,
        ProfileController_1.ProfileController,
        FikaConfig_1.FikaConfig,
        ConfigServer_1.ConfigServer])
], FikaDedicatedProfileService);
