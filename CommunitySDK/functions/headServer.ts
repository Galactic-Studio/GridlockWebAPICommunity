import databaseService from "../database";
import * as objects from "../types/objects";
import * as enums from "../types/enums";


export const createHeadServer = async (headServer:objects.headServer) => {
    return new Promise(async (resolve, reject) => {
        resolve(await databaseService.serverManagementService.startHeadServerService(headServer.name, headServer.region, enums.branches[headServer.branch], enums.sizes[headServer.size], headServer.allowOther))
    })
}
export const registerHeadServer = async(headServerData:objects.headServer)=>{
    return new Promise<void>(async (resolve)=>{
        const ref = databaseService.headServers.doc(headServerData.serverId)
        await ref.set(headServerData, {merge:true})
        resolve()
    })
}

export const stopHeadServer = async(serverId:string)=>{
    return new Promise<void>(async (resolve)=>{
        const ref = databaseService.headServers.doc(serverId)
        let data = (await ref.get()).data()
        data.status = enums.serverStatus.Quiting
        await databaseService.serverManagementService.communicateWithHeadServer(data.address,"shutdownServer", {}, "POST", data.authCode)
        await ref.set(data, {merge:true})
        resolve()
    })
}

export const registerDeleteHeadServer = async (serverId:string)=>{ //TODO: update this function for update usages
    return new Promise<void>(async (resolve)=>{
        const ref = databaseService.headServers.doc(serverId)
        let data = (await ref.get()).data()
        await ref.delete()
        resolve()
    })
}

export const getBestHeadServer = async (gameId:string, dedicated:boolean)=>{
    return new Promise(async (resolve, reject)=>{
        const ref = await databaseService.headServers.where("allowOther", "==", !dedicated).get()
        if(ref.size <= 0){
            let server = await databaseService.serverManagementService.startHeadServerService(null, "nyc", enums.branches.Dev, enums.sizes.Small, true) //TODO: Update this to make it more specific and create a match making like system
            server.promise.then(resolvedValue => {
                Object.assign(server.serverInfo, resolvedValue);
                console.log('Updated object:', server.serverInfo);
            });

            resolve(await databaseService.headServers.doc(server.serverInfo.serverId).get())
        }else{
            let readiedServer = undefined
            ref.forEach((doc) =>{
                let data = doc.data()
                console.log(data)
                console.log(data["status"])
                switch (data["status"]){
                    case enums.serverStatus.Ready:
                        console.log("Server Ready")
                        console.log(data)
                        if((data["status"] === enums.serverStatus.Ready && readiedServer === undefined) || (data["status"] === enums.serverStatus.Ready && readiedServer["serverCount"] > data.serverCount)){
                            readiedServer = data
                        }
                        break
                    case enums.serverStatus.Starting:
                        if (readiedServer["status"] === enums.serverStatus.Ready){
                            break
                        }else{
                            readiedServer = data
                            break
                        }
                    default:
                        break
                }

            })
            console.log(readiedServer)
            resolve(readiedServer)
        }
    })
}

export const checkHeadAuth = (authCode:string, serverId:string)=>{
    return new Promise(async (resolve, reject)=> {
        let doc = await databaseService.headServers.doc(serverId).get()
        let refAuthCode = doc.get("authCode")
        if (authCode === refAuthCode){
            resolve(true)
        }else{
            resolve(false)
        }
    })
}

export const setHeadServerStatus = (serverId:string, status:enums.serverStatus)=>{
    return new Promise<void>(async (resolve, reject)=>{
        const ref = databaseService.headServers.doc(serverId)
        let data = (await ref.get()).data()
        console.log(status)
        data.status = status
        await ref.set(data, {merge:true})
        resolve()
    })
}