import * as objects from "../types/objects";
import * as enums from "../types/enums";
/**
 * Creates and starts a head server with the specified configuration.
 *
 * @param {objects.headServer} headServer - An object containing the configuration for the head server.
 * @returns A promise that resolves when the head server is successfully started.
 */
export declare const createHeadServer: (headServer: objects.headServer) => Promise<unknown>;
/**
 * Registers a head server in the database.
 *
 * @param {objects.headServer} headServerData - The data of the head server to be registered.
 * @returns A promise that resolves when the head server data has been successfully set in the database.
 */
export declare const registerHeadServer: (headServerData: objects.headServer) => Promise<void>;
/**
 * Stops the head server by updating its status to 'Quiting' and sending a shutdown command.
 *
 * @param {string} serverId - The unique identifier of the head server to be stopped.
 * @returns A promise that resolves when the server has been successfully stopped.
 */
export declare const stopHeadServer: (serverId: string) => Promise<void>;
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
export declare const registerDeleteHeadServer: (serverId: string) => Promise<void>;
export declare const getBestHeadServer: (gameId: string, dedicated: boolean) => Promise<unknown>;
export declare const checkHeadAuth: (authCode: string, serverId: string) => Promise<unknown>;
export declare const setHeadServerStatus: (serverId: string, status: enums.serverStatus) => Promise<void>;
