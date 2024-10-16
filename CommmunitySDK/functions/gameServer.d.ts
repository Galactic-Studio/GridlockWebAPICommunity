import * as objects from "../types/objects";
import * as enums from "../types/enums";
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
export declare const startGameServer: (ownerId: string, gameId: string, serverMap: string, serverName: string, branch: string, serverType: enums.serverTypes, maxPlayers: number, peerServerJoinId?: string, metadata?: {
    [key: string]: string;
}) => Promise<objects.childServer>;
/**
 * Closes a game server by deleting its document from the database.
 *
 * @param gameId - The ID of the game to which the server belongs.
 * @param serverId - The ID of the server to be closed.
 * @returns A promise that resolves when the server document is successfully deleted.
 */
export declare const closeGameServer: (gameId: string, serverId: string) => Promise<void>;
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
export declare const setGameServerData: (gameId: string, serverId: string, status: enums.serverStatus, body: any) => Promise<void>;
/**
 * Retrieves the status of a game server.
 *
 * @param serverId - The unique identifier of the server.
 * @param gameId - The unique identifier of the game.
 * @returns A promise that resolves with the status of the game server if found, or rejects with an error message if the server is not found.
 */
export declare const getGameServerStatus: (serverId: string, gameId: string) => Promise<unknown>;
/**
 * Retrieves the game servers for a given game ID.
 *
 * @param gameId - The ID of the game for which to retrieve servers.
 * @returns A promise that resolves to an object containing an array of server data.
 */
export declare const getGameServers: (gameId: any) => Promise<unknown>;
/**
 * Retrieves a list of game servers that are ready for a given game ID.
 *
 * @param gameId - The ID of the game for which to retrieve ready servers.
 * @returns A promise that resolves to an object containing an array of ready game servers.
 */
export declare const getReadyGameServers: (gameId: any) => Promise<unknown>;
/**
 * Retrieves a paginated list of game servers that are ready.
 *
 * @param {string} gameId - The unique identifier of the game.
 * @param {number} page - The page number to retrieve.
 * @param {number} [pageSize=16] - The number of servers per page. Defaults to 16.
 * @returns {Promise<{servers: any[]}>} A promise that resolves to an object containing an array of server data.
 */
export declare const getGameServerPage: (gameId: string, page: number, pageSize?: number) => Promise<unknown>;
