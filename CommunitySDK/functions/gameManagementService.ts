import databaseService from "../database";
import * as objects from "../types/objects";
import * as enums from "../types/enums";
import * as util from "./util";

export const createGame = (gameInfo:objects.GameObject)=>{
    return new Promise(async (resolve)=>{
        gameInfo.gameId = await util.createAndCheckId(databaseService.games, 12)
        await databaseService.games.doc(gameInfo.gameId).set(gameInfo)
        resolve(gameInfo)
    })
}

export const checkApiKey=(apiKey:string, gameId:string)=>{
    return new Promise(async (resolve, reject) => {
        const gameDoc = await databaseService.games.doc(gameId).get();
        let gameApiKey = gameDoc.get("apiKey");
        if (gameApiKey) {
            resolve((apiKey === gameApiKey))
        }else{
            reject("Game Not Found")
        }
    })
}