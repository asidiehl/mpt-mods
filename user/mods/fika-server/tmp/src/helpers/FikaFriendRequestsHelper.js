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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FikaFriendRequestsHelper = void 0;
const tsyringe_1 = require("tsyringe");
const HashUtil_1 = require("@spt/utils/HashUtil");
const FikaFriendRequestsCacheService_1 = require("../services/cache/FikaFriendRequestsCacheService");
const SaveServer_1 = require("@spt/servers/SaveServer");
const SptWebSocketConnectionHandler_1 = require("@spt/servers/ws/SptWebSocketConnectionHandler");
const LogTextColor_1 = require("@spt/models/spt/logging/LogTextColor");
let FikaFriendRequestsHelper = class FikaFriendRequestsHelper {
    hashUtil;
    fikaFriendRequestsCacheService;
    saveServer;
    webSocketHandler;
    logger;
    constructor(hashUtil, fikaFriendRequestsCacheService, saveServer, webSocketHandler, logger) {
        this.hashUtil = hashUtil;
        this.fikaFriendRequestsCacheService = fikaFriendRequestsCacheService;
        this.saveServer = saveServer;
        this.webSocketHandler = webSocketHandler;
        this.logger = logger;
        // empty
    }
    /**
     * Returns the friend requests that were sent to the given player
     * @param profileId
     * @returns
     */
    getReceivedFriendRequests(profileId) {
        return this.fikaFriendRequestsCacheService.getReceivedFriendRequests(profileId);
    }
    /**
     * Returns the friend requests that were sent by the given player
     * @param profileId
     * @returns
     */
    getSentFriendRequests(profileId) {
        return this.fikaFriendRequestsCacheService.getSentFriendRequests(profileId);
    }
    /**
     * Adds a friend request
     * @param fromProfileId
     * @param toProfileId
     */
    addFriendRequest(fromProfileId, toProfileId) {
        if (this.fikaFriendRequestsCacheService.exists(fromProfileId, toProfileId)) {
            this.logger.logWithColor(`Friend request ${fromProfileId}->${toProfileId} already exists`, LogTextColor_1.LogTextColor.YELLOW);
            return;
        }
        this.fikaFriendRequestsCacheService.storeFriendRequest({
            _id: this.hashUtil.generate(),
            from: fromProfileId,
            to: toProfileId,
            date: Math.round(Date.now() / 1000),
        });
        let profile = this.saveServer.getProfile(fromProfileId);
        if (profile) {
            this.logger.logWithColor(`Sending WebSocket message to ${toProfileId}`, LogTextColor_1.LogTextColor.GREEN);
            this.webSocketHandler.sendMessage(toProfileId, {
                type: "friendListNewRequest",
                eventId: "friendListNewRequest",
                _id: fromProfileId,
                profile: {
                    _id: profile.info.id,
                    aid: profile.info.aid,
                    Info: {
                        Nickname: profile.characters.pmc.Info.Nickname,
                        Side: profile.characters.pmc.Info.Side,
                        Level: profile.characters.pmc.Info.Level,
                        MemberCategory: profile.characters.pmc.Info.MemberCategory,
                        SelectedMemberCategory: profile.characters.pmc.Info.MemberCategory,
                        Ignored: false,
                        Banned: profile.characters.pmc.Info.BannedState
                    }
                }
            });
        }
        else {
            this.logger.logWithColor(`Could not find profile for ${fromProfileId}`, LogTextColor_1.LogTextColor.RED);
        }
    }
    /**
     * Removes a friend request
     * @param fromProfileId
     * @param toProfileId
     */
    removeFriendRequest(fromProfileId, toProfileId, reason) {
        if (!this.fikaFriendRequestsCacheService.exists(fromProfileId, toProfileId)) {
            this.logger.warning(`Friend request ${fromProfileId}->${toProfileId} doesn't exist`);
            return;
        }
        this.logger.info(`reason (${reason}), fromProfileId (${fromProfileId}), toProfileId (${toProfileId})`);
        this.fikaFriendRequestsCacheService.deleteFriendRequest(fromProfileId, toProfileId);
        switch (reason) {
            case "accept": {
                const profile = this.saveServer.getProfile(toProfileId);
                this.webSocketHandler.sendMessage(fromProfileId, {
                    type: "friendListRequestAccept",
                    eventId: "friendListRequestAccept",
                    profile: {
                        _id: profile.info.id,
                        aid: profile.info.aid,
                        Info: {
                            Nickname: profile.characters.pmc.Info.Nickname,
                            Side: profile.characters.pmc.Info.Side,
                            Level: profile.characters.pmc.Info.Level,
                            MemberCategory: profile.characters.pmc.Info.MemberCategory,
                            SelectedMemberCategory: profile.characters.pmc.Info.MemberCategory,
                            Ignored: false,
                            Banned: profile.characters.pmc.Info.BannedState
                        }
                    }
                });
                break;
            }
            case "cancel": {
                const profile = this.saveServer.getProfile(fromProfileId);
                this.webSocketHandler.sendMessage(toProfileId, {
                    type: "friendListRequestCancel",
                    eventId: "friendListRequestCancel",
                    profile: {
                        _id: profile.info.id,
                        aid: profile.info.aid,
                        Info: {
                            Nickname: profile.characters.pmc.Info.Nickname,
                            Side: profile.characters.pmc.Info.Side,
                            Level: profile.characters.pmc.Info.Level,
                            MemberCategory: profile.characters.pmc.Info.MemberCategory,
                            SelectedMemberCategory: profile.characters.pmc.Info.MemberCategory,
                            Ignored: false,
                            Banned: profile.characters.pmc.Info.BannedState
                        }
                    }
                });
                break;
            }
            case "decline": {
                const profile = this.saveServer.getProfile(toProfileId);
                this.webSocketHandler.sendMessage(fromProfileId, {
                    type: "friendListRequestDecline",
                    eventId: "friendListRequestDecline",
                    profile: {
                        _id: profile.info.id,
                        aid: profile.info.aid,
                        Info: {
                            Nickname: profile.characters.pmc.Info.Nickname,
                            Side: profile.characters.pmc.Info.Side,
                            Level: profile.characters.pmc.Info.Level,
                            MemberCategory: profile.characters.pmc.Info.MemberCategory,
                            SelectedMemberCategory: profile.characters.pmc.Info.MemberCategory,
                            Ignored: false,
                            Banned: profile.characters.pmc.Info.BannedState
                        }
                    }
                });
                break;
            }
        }
    }
};
exports.FikaFriendRequestsHelper = FikaFriendRequestsHelper;
exports.FikaFriendRequestsHelper = FikaFriendRequestsHelper = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("HashUtil")),
    __param(1, (0, tsyringe_1.inject)("FikaFriendRequestsCacheService")),
    __param(2, (0, tsyringe_1.inject)("SaveServer")),
    __param(3, (0, tsyringe_1.inject)("SptWebSocketConnectionHandler")),
    __param(4, (0, tsyringe_1.inject)("WinstonLogger")),
    __metadata("design:paramtypes", [HashUtil_1.HashUtil,
        FikaFriendRequestsCacheService_1.FikaFriendRequestsCacheService,
        SaveServer_1.SaveServer,
        SptWebSocketConnectionHandler_1.SptWebSocketConnectionHandler, Object])
], FikaFriendRequestsHelper);
