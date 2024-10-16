"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logPlayerOut = exports.logPlayerIn = void 0;
const database_1 = __importDefault(require("../database"));
const logPlayerIn = (gameId, playerId, serverId = "") => {
    return new Promise(async (resolve, reject) => {
        const ref = database_1.default.games.doc(gameId).collection("players").doc(playerId);
        let data = (await ref.get()).data();
        if (!data) {
            data = {
                playerId: playerId,
                PlayerLoggedIn: true,
                serverId: serverId,
            };
            await ref.set(data);
        }
        if (data.PlayerLoggedIn === true) {
            reject("Player Already Logged In");
            return;
        }
        else if (data.PlayerLoggedIn == undefined || data.PlayerLoggedIn === false) {
            data.PlayerLoggedIn = true;
            data.serverId = serverId;
            await ref.set(data, { merge: true });
        }
        resolve();
    });
};
exports.logPlayerIn = logPlayerIn;
const logPlayerOut = (gameId, playerId) => {
    return new Promise(async (resolve, reject) => {
        const ref = await database_1.default.games.doc(gameId).collection("players").doc(playerId);
        let data = (await ref.get()).data();
        if (!data) {
            data = {};
        }
        await ref.set({
            PlayerLoggedIn: false,
            sessionId: null,
        }, { merge: true });
        resolve();
    });
};
exports.logPlayerOut = logPlayerOut;
