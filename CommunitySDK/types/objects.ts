import {serverStatus, branches, sizes, serverTypes} from "./enums";
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
        [key:string]:{
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