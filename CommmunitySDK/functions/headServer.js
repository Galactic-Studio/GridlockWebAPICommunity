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
exports.setHeadServerStatus = exports.checkHeadAuth = exports.getBestHeadServer = exports.registerDeleteHeadServer = exports.stopHeadServer = exports.registerHeadServer = exports.createHeadServer = void 0;
const database_1 = __importDefault(require("../database"));
const enums = __importStar(require("../types/enums"));
/**
 * Creates and starts a head server with the specified configuration.
 *
 * @param {objects.headServer} headServer - An object containing the configuration for the head server.
 * @returns A promise that resolves when the head server is successfully started.
 */
const createHeadServer = async (headServer) => {
    return new Promise(async (resolve, reject) => {
        resolve(await database_1.default.serverManagementService.startHeadServerService(headServer.name, headServer.region, enums.branches[headServer.branch], enums.sizes[headServer.size], headServer.allowOther));
    });
};
exports.createHeadServer = createHeadServer;
/**
 * Registers a head server in the database.
 *
 * @param {objects.headServer} headServerData - The data of the head server to be registered.
 * @returns A promise that resolves when the head server data has been successfully set in the database.
 */
const registerHeadServer = async (headServerData) => {
    return new Promise(async (resolve) => {
        const ref = database_1.default.headServers.doc(headServerData.serverId);
        await ref.set(headServerData, { merge: true });
        resolve();
    });
};
exports.registerHeadServer = registerHeadServer;
/**
 * Stops the head server by updating its status to 'Quiting' and sending a shutdown command.
 *
 * @param {string} serverId - The unique identifier of the head server to be stopped.
 * @returns A promise that resolves when the server has been successfully stopped.
 */
const stopHeadServer = async (serverId) => {
    return new Promise(async (resolve) => {
        const ref = database_1.default.headServers.doc(serverId);
        let data = (await ref.get()).data();
        data.status = enums.serverStatus.Quiting;
        await database_1.default.serverManagementService.communicateWithHeadServer(data.address, "shutdownServer", {}, "POST", data.authCode);
        await ref.set(data, { merge: true });
        resolve();
    });
};
exports.stopHeadServer = stopHeadServer;
/**
 * Registers and deletes a head server from the database.
 *
 * @param {string} serverId - The unique identifier of the server to be deleted.
 * @returns A promise that resolves when the server has been successfully deleted.
 *
 * @remarks
 * This function retrieves the server data from the database using the provided serverId,
 * deletes the server entry, and then resolves the promise.
 *
 * @todo Update this function for update usages.
 */
const registerDeleteHeadServer = async (serverId) => {
    return new Promise(async (resolve) => {
        const ref = database_1.default.headServers.doc(serverId);
        let data = (await ref.get()).data();
        await ref.delete();
        resolve();
    });
};
exports.registerDeleteHeadServer = registerDeleteHeadServer;
const getBestHeadServer = async (gameId, dedicated) => {
    return new Promise(async (resolve, reject) => {
        const ref = await database_1.default.headServers.where("allowOther", "==", !dedicated).get();
        if (ref.size <= 0) {
            let server = await database_1.default.serverManagementService.startHeadServerService(null, "nyc", enums.branches.Dev, enums.sizes.Small, true); //TODO: Update this to make it more specific and create a match making like system
            server.promise.then(resolvedValue => {
                Object.assign(server.serverInfo, resolvedValue);
                console.log('Updated object:', server.serverInfo);
            });
            resolve(await database_1.default.headServers.doc(server.serverInfo.serverId).get());
        }
        else {
            let readiedServer = undefined;
            ref.forEach((doc) => {
                let data = doc.data();
                console.log(data);
                console.log(data["status"]);
                switch (data["status"]) {
                    case enums.serverStatus.Ready:
                        console.log("Server Ready");
                        console.log(data);
                        if ((data["status"] === enums.serverStatus.Ready && readiedServer === undefined) || (data["status"] === enums.serverStatus.Ready && readiedServer["serverCount"] > data.serverCount)) {
                            readiedServer = data;
                        }
                        break;
                    case enums.serverStatus.Starting:
                        if (readiedServer["status"] === enums.serverStatus.Ready) {
                            break;
                        }
                        else {
                            readiedServer = data;
                            break;
                        }
                    default:
                        break;
                }
            });
            console.log(readiedServer);
            resolve(readiedServer);
        }
    });
};
exports.getBestHeadServer = getBestHeadServer;
const checkHeadAuth = (authCode, serverId) => {
    return new Promise(async (resolve, reject) => {
        let doc = await database_1.default.headServers.doc(serverId).get();
        let refAuthCode = doc.get("authCode");
        if (authCode === refAuthCode) {
            resolve(true);
        }
        else {
            resolve(false);
        }
    });
};
exports.checkHeadAuth = checkHeadAuth;
const setHeadServerStatus = (serverId, status) => {
    return new Promise(async (resolve, reject) => {
        const ref = database_1.default.headServers.doc(serverId);
        let data = (await ref.get()).data();
        console.log(status);
        data.status = status;
        await ref.set(data, { merge: true });
        resolve();
    });
};
exports.setHeadServerStatus = setHeadServerStatus;
