import databaseService from "../database";
import { AxiosResponse } from "axios";
import * as headServerService from "./headServer";
import * as objects from "../types/objects";
import * as enums from "../types/enums";
import * as util from "./util";

export const startGameServer = (ownerId:string, gameId:string, serverMap:string, serverName:string, branch: string, serverType: enums.serverTypes, maxPlayers:number, peerServerJoinId?:string, metadata?:{[key:string]:string})=>{
    return new Promise<objects.childServer>(async (resolve,reject)=>{
        let serverData = <objects.childServer>{};
        let serverId = <string>await util.createAndCheckId(databaseService.games.doc(gameId).collection("servers"),16)
        serverId = gameId+"-"+serverId.toString()
        const ref = databaseService.games.doc(gameId).collection("servers").doc(serverId)
        serverData = {
            name:serverName,
            serverId: serverId,
            gameId: gameId,
            serverMap: serverMap,
            status: enums.serverStatus.Starting,
            branch: branch || enums.branches.Release,
            maxPlayers: maxPlayers,
            serverType: serverType,
            serverJoinKey: peerServerJoinId || "",
            directJoinCode: util.createCode(6,"hex"),
            metadata: metadata || {}
        }
        if(serverType === enums.serverTypes.dedicated){
            let headServer = <objects.headServer>await headServerService.getBestHeadServer(gameId, false)
            console.log(headServer);
            serverData.serverAddress = headServer.address || ""
            console.log(serverData)
            await ref.set(serverData)
            let res = <AxiosResponse> await databaseService.serverManagementService.communicateWithHeadServer(headServer.address, `createGameServer/${serverId}`, {
                serverName:serverName,
                ownerId:ownerId,
                gameId:gameId,
                serverMap: serverMap
            },"POST", headServer.authCode).catch(err=>{
                console.log(err)
                reject(err)
            })
            console.log(res)
            if(res.status === 201){
                console.log("Server Accepted and Started")
            }else{
                console.log(res)
            }
        }
        
        console.log(serverData)
        await ref.set(serverData)
        resolve(serverData)
    })
}


export const closeGameServer = (gameId:string, serverId:string)=>{
    return new Promise<void>(async (resolve, reject)=>{
        const ref = databaseService.games.doc(gameId).collection("servers").doc(serverId)
        await ref.delete()
        resolve()
    })
}

export const setGameServerData = (gameId:string, serverId:string, status:enums.serverStatus,  body)=>{
    return new Promise<void>(async (resolve, reject)=>{
        const ref = databaseService.games.doc(gameId).collection("servers").doc(serverId)
        let data = (await ref.get()).data()
        data.status = status || data.status ||enums.serverStatus.Ready
        data.port = body.port || data.port
        data.dataPort = body.dataPort || data.dataPort
        data.numPlayers = body.numPlayers || data.numPlayers
        data.address = body.address || data.address
        await ref.set(data, {merge:true});
        resolve()
    })
}

export const getGameServerStatus=(serverId:string, gameId:string)=>{
    return new Promise(async (resolve, reject)=>{
        const ref = await databaseService.games.doc(gameId).collection("servers").doc(serverId).get()
        if (ref.exists){
            resolve(await ref.get("status"))
        }else{
            reject("Server Not Found")
        }
    })
}

export const getGameServers=(gameId)=>{
    return new Promise(async (resolve, reject)=>{
        const ref = await databaseService.games.doc(gameId).collection("servers").get()
        const data = ref.docs.map(doc => doc.data())
        resolve({"servers":data})
    })
}

export const getReadyGameServers=(gameId)=>{
    return new Promise(async (resolve, reject)=>{
        const ref = await databaseService.games.doc(gameId).collection("servers").where("status","==",enums.serverStatus.Ready).get()
        const data = ref.docs.map(doc => doc.data())
        resolve({"servers":data})
    })
}

export const getGameServerPage=(gameId:string, page:number, pageSize:number = 16)=>{
    return new Promise(async (resolve, reject)=>{
        const pageSizeNum = parseInt(pageSize.toString())
        const ref = await databaseService.games.doc(gameId).collection("servers").where("status","==", enums.serverStatus.Ready).limit(pageSizeNum).offset(page*pageSizeNum).get()
        const data = ref.docs.map(doc => doc.data())
        resolve({"servers":data})
    })
}