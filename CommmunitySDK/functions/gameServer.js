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
exports.getGameServerPage = exports.getReadyGameServers = exports.getGameServers = exports.getGameServerStatus = exports.setGameServerData = exports.closeGameServer = exports.startGameServer = void 0;
const database_1 = __importDefault(require("../database"));
const headServerService = __importStar(require("./headServer"));
const enums = __importStar(require("../types/enums"));
const util = __importStar(require("./util"));
/**
 * Starts a new game server with the specified parameters.
 *
 * @param ownerId - The ID of the owner of the game server.
 * @param gameId - The ID of the game for which the server is being started.
 * @param serverMap - The map on which the game server will run.
 * @param serverName - The name of the game server.
 * @param branch - The branch of the game (e.g., release, beta).
 * @param serverType - The type of the server (e.g., dedicated, peer-to-peer).
 * @param maxPlayers - The maximum number of players allowed on the server.
 * @param peerServerJoinId - (Optional) The join ID for peer servers. If not set and is a P2P server, a random join ID will be generated.
 * @param metadata - (Optional) Additional metadata for the server.
 * @returns A promise that resolves to an object representing the child server.
 */
const startGameServer = (ownerId, gameId, serverMap, serverName, branch, serverType, maxPlayers, peerServerJoinId, metadata) => {
    return new Promise(async (resolve, reject) => {
        let serverData = {};
        let serverId = await util.createAndCheckId(database_1.default.games.doc(gameId).collection("servers"), 16);
        serverId = gameId + "-" + serverId.toString();
        const ref = database_1.default.games.doc(gameId).collection("servers").doc(serverId);
        serverData = {
            name: serverName,
            serverId: serverId,
            gameId: gameId,
            serverMap: serverMap,
            status: enums.serverStatus.Starting,
            branch: branch || enums.branches.Release,
            maxPlayers: maxPlayers,
            serverType: serverType,
            serverJoinKey: peerServerJoinId || "",
            directJoinCode: util.createCode(6, "hex"),
            metadata: metadata || {}
        };
        if (serverType === enums.serverTypes.dedicated) {
            let headServer = await headServerService.getBestHeadServer(gameId, false);
            console.log(headServer);
            serverData.serverAddress = headServer.address || "";
            console.log(serverData);
            await ref.set(serverData);
            let res = await database_1.default.serverManagementService.communicateWithHeadServer(headServer.address, `createGameServer/${serverId}`, {
                serverName: serverName,
                ownerId: ownerId,
                gameId: gameId,
                serverMap: serverMap
            }, "POST", headServer.authCode).catch(err => {
                console.log(err);
                reject(err);
            });
            console.log(res);
            if (res.status === 201) {
                console.log("Server Accepted and Started");
            }
            else {
                console.log(res);
            }
        }
        console.log(serverData);
        await ref.set(serverData);
        resolve(serverData);
    });
};
exports.startGameServer = startGameServer;
/**
 * Closes a game server by deleting its document from the database.
 *
 * @param gameId - The ID of the game to which the server belongs.
 * @param serverId - The ID of the server to be closed.
 * @returns A promise that resolves when the server document is successfully deleted.
 */
const closeGameServer = (gameId, serverId) => {
    return new Promise(async (resolve, reject) => {
        const ref = database_1.default.games.doc(gameId).collection("servers").doc(serverId);
        await ref.delete();
        resolve();
    });
};
exports.closeGameServer = closeGameServer;
/**
 * Sets the game server data for a specific game and server.
 *
 * @param {string} gameId - The ID of the game.
 * @param {string} serverId - The ID of the server.
 * @param {enums.serverStatus} status - The status of the server.
 * @param {object} body - The body containing server data.
 * @param {number} [body.port] - The port number of the server.
 * @param {number} [body.dataPort] - The data port number of the server.
 * @param {number} [body.numPlayers] - The number of players on the server.
 * @param {string} [body.address] - The address of the server.
 * @returns {Promise<void>} A promise that resolves when the server data is set.
 */
const setGameServerData = (gameId, serverId, status, body) => {
    return new Promise(async (resolve, reject) => {
        const ref = database_1.default.games.doc(gameId).collection("servers").doc(serverId);
        let data = (await ref.get()).data();
        data.status = status || data.status || enums.serverStatus.Ready;
        data.port = body.port || data.port;
        data.dataPort = body.dataPort || data.dataPort;
        data.numPlayers = body.numPlayers || data.numPlayers;
        data.address = body.address || data.address;
        await ref.set(data, { merge: true });
        resolve();
    });
};
exports.setGameServerData = setGameServerData;
/**
 * Retrieves the status of a game server.
 *
 * @param serverId - The unique identifier of the server.
 * @param gameId - The unique identifier of the game.
 * @returns A promise that resolves with the status of the game server if found, or rejects with an error message if the server is not found.
 */
const getGameServerStatus = (serverId, gameId) => {
    return new Promise(async (resolve, reject) => {
        const ref = await database_1.default.games.doc(gameId).collection("servers").doc(serverId).get();
        if (ref.exists) {
            resolve(await ref.get("status"));
        }
        else {
            reject("Server Not Found");
        }
    });
};
exports.getGameServerStatus = getGameServerStatus;
/**
 * Retrieves the game servers for a given game ID.
 *
 * @param gameId - The ID of the game for which to retrieve servers.
 * @returns A promise that resolves to an object containing an array of server data.
 */
const getGameServers = (gameId) => {
    return new Promise(async (resolve, reject) => {
        const ref = await database_1.default.games.doc(gameId).collection("servers").get();
        const data = ref.docs.map(doc => doc.data());
        resolve({ "servers": data });
    });
};
exports.getGameServers = getGameServers;
/**
 * Retrieves a list of game servers that are ready for a given game ID.
 *
 * @param gameId - The ID of the game for which to retrieve ready servers.
 * @returns A promise that resolves to an object containing an array of ready game servers.
 */
const getReadyGameServers = (gameId) => {
    return new Promise(async (resolve, reject) => {
        const ref = await database_1.default.games.doc(gameId).collection("servers").where("status", "==", enums.serverStatus.Ready).get();
        const data = ref.docs.map(doc => doc.data());
        resolve({ "servers": data });
    });
};
exports.getReadyGameServers = getReadyGameServers;
/**
 * Retrieves a paginated list of game servers that are ready.
 *
 * @param {string} gameId - The unique identifier of the game.
 * @param {number} page - The page number to retrieve.
 * @param {number} [pageSize=16] - The number of servers per page. Defaults to 16.
 * @returns {Promise<{servers: any[]}>} A promise that resolves to an object containing an array of server data.
 */
const getGameServerPage = (gameId, page, pageSize = 16) => {
    return new Promise(async (resolve, reject) => {
        const pageSizeNum = parseInt(pageSize.toString());
        const ref = await database_1.default.games.doc(gameId).collection("servers").where("status", "==", enums.serverStatus.Ready).limit(pageSizeNum).offset(page * pageSizeNum).get();
        const data = ref.docs.map(doc => doc.data());
        resolve({ "servers": data });
    });
};
exports.getGameServerPage = getGameServerPage;
