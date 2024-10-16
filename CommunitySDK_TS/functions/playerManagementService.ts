import databaseService from "../database";
import * as objects from "../types/objects";
import * as enums from "../types/enums";
import * as util from "./util";

export const logPlayerIn=(gameId:string,  playerId:string, serverId:string = "")=>{
    return new Promise<void>(async (resolve, reject)=>{
        const ref = databaseService.games.doc(gameId).collection("players").doc(playerId)
        let data = (await ref.get()).data()
        if(!data){
            data = {
                playerId: playerId,
                PlayerLoggedIn: true,
                serverId: serverId,
            }
            await ref.set(data)
        }
        if (data.PlayerLoggedIn === true){
            reject("Player Already Logged In")
            return
        }else if(data.PlayerLoggedIn == undefined || data.PlayerLoggedIn === false){
            data.PlayerLoggedIn = true
            data.serverId = serverId
            await ref.set(data, {merge:true})
        }
        resolve()
    })
}
export const logPlayerOut=(gameId:string,  playerId:string)=>{
    return new Promise<void>(async (resolve, reject)=>{
        const ref = await databaseService.games.doc(gameId).collection("players").doc(playerId)
        let data = (await ref.get()).data()
        if(!data){
            data = {}
        }
        await ref.set({
            PlayerLoggedIn: false,
            sessionId: null,
        }, {merge:true})
        resolve()
    })
}