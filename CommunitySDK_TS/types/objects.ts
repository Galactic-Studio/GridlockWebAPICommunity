import {serverStatus, branches, sizes, serverTypes} from "./enums";

/**
 * Represents a child server with various properties including its status, type, and connection details.
 * 
 * @interface childServer
 * 
 * @property {string} name - The name of the child server.
 * @property {string} serverId - The unique identifier for the server.
 * @property {string} gameId - The unique identifier for the game associated with the server.
 * @property {serverStatus} status - The current status of the server.
 * @property {string} branch - The branch of the server.
 * @property {number} maxPlayers - The maximum number of players that can join the server.
 * @property {number} [currentPlayers=0] - The current number of players on the server. Defaults to 0 if not provided.
 * @property {number} [ping=0] - The ping of the server. Defaults to 0 if not provided.
 * @property {string | null} [region=null] - The region where the server is located. Defaults to null if not provided.
 * @property {string | null} [serverAddress=null] - The address of the server. Defaults to null if not provided.
 * @property {number} [childServerPort] - The port number of the child server.
 * @property {string | null} [serverMap=null] - The map currently being used by the server. Defaults to null if not provided.
 * @property {serverTypes | serverTypes.peer} serverType - The type of the server.
 * @property {string} [serverJoinKey] - The join key for peer-to-peer servers only.
 * @property {string} [directJoinCode] - A short string for players to share to quickly join the server.
 * @property {Object.<string, any>} [metadata] - Additional metadata associated with the server.
 */
interface childServer {
    name: string
    serverId: string
    gameId: string
    status: serverStatus
    branch: string
    maxPlayers: number
    currentPlayers?: number | 0
    ping?: number | 0
    region?: string | null
    serverAddress?: string | null
    childServerPort?: number 
    serverMap?: string | null
    serverType: serverTypes | serverTypes.peer
    serverJoinKey?: string //for peer-to-peer servers only
    directJoinCode?: string //short string for players to share to quickly join the server
    metadata?: {
        [key: string]: any
    }
}

/**
 * Represents a game object within the community SDK.
 * 
 * @interface GameObject
 * 
 * @property {string} name - The name of the game object.
 * @property {string} [gameId] - Optional unique identifier for the game.
 * @property {string} [description] - Optional description of the game object.
 * @property {Object.<string, {branchName: string, branchDescription?: string, branchId: string, branchType: branches, branchPath: string}>} branches - 
 * An object containing branches, where each key is a branchId and the value is an object with branch details.
 * @property {Object.<string, {mapName: string, mapId: string, mapPath: string, mapDescription?: string}>} [maps] - 
 * Optional object containing maps, where each key is a mapId and the value is an object with map details.
 * @property {Object.<string, any>} [config] - Optional configuration object with key-value pairs.
 * @property {string} apiKey - The API key required for the community SDK due to backend considerations.
 */
interface GameObject{
    name: string,
    gameId?: string,
    description?: string,
    branches: { //Default branch is randomly automatically generated
        [key:string]:{ //Key is the branchId
            branchName: string,
            branchDescription?: string,
            branchId: string,
            branchType: branches,
            branchPath: string, //The path to the branch in AWS, root being the gameId. 
        }
    }
    maps?: { //Reference to the maps in the game, must have at least 1. 
        [key:string]:{ //Key is the mapId
            mapName: string,
            mapId: string,
            mapPath: string,
            mapDescription?: string
        }
    },
    config?: {
        [key:string]:any
    }, 
    apiKey: string, //Is required on community SDK due to backend considerations.
}

interface headServer{
    name?: string
    serverId?: string
    status?: serverStatus
    address?: string
    authCode?: string
    serverCount?: number
    allowOther: boolean
    dedicatedGameId?: string
    dnsId?: string
    size: sizes
    ip?: string
    branch: branches
    region: string
    passKey?: {
        keyName: string
        passInfo: string
    }
}


export {childServer,headServer,GameObject}