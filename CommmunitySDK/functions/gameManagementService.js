"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkApiKey = exports.createGame = void 0;
const database_1 = __importDefault(require("../database"));
const util = __importStar(require("./util"));
/**
 * Creates a new game entry in the database with a unique game ID.
 *
 * @param gameInfo - An object containing the game information to be stored.
 * @returns A promise that resolves to the game information object with the newly created game ID.
 */
const createGame = (gameInfo) => {
    return new Promise(async (resolve) => {
        gameInfo.gameId = await util.createAndCheckId(database_1.default.games, 12);
        await database_1.default.games.doc(gameInfo.gameId).set(gameInfo);
        resolve(gameInfo);
    });
};
exports.createGame = createGame;
/**
 * Checks if the provided API key matches the API key stored for the given game ID.
 *
 * @param apiKey - The API key to be validated.
 * @param gameId - The ID of the game whose API key is to be checked.
 * @returns A promise that resolves to a boolean indicating whether the API key is valid.
 *          If the game is not found, the promise is rejected with an error message.
 */
const checkApiKey = (apiKey, gameId) => {
    return new Promise(async (resolve, reject) => {
        const gameDoc = await database_1.default.games.doc(gameId).get();
        let gameApiKey = gameDoc.get("apiKey");
        if (gameApiKey) {
            resolve((apiKey === gameApiKey));
        }
        else {
            reject("Game Not Found");
        }
    });
};
exports.checkApiKey = checkApiKey;
