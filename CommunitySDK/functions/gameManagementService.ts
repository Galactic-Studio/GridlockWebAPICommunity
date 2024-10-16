import databaseService from "../database";
import * as objects from "../types/objects";
import * as enums from "../types/enums";
import * as util from "./util";

/**
 * Creates a new game entry in the database with a unique game ID.
 *
 * @param gameInfo - An object containing the game information to be stored.
 * @returns A promise that resolves to the game information object with the newly created game ID.
 */
export const createGame = (gameInfo:objects.GameObject)=>{
    return new Promise(async (resolve)=>{
        gameInfo.gameId = await util.createAndCheckId(databaseService.games, 12)
        await databaseService.games.doc(gameInfo.gameId).set(gameInfo)
        resolve(gameInfo)
    })
}

/**
 * Checks if the provided API key matches the API key stored for the given game ID.
 *
 * @param apiKey - The API key to be validated.
 * @param gameId - The ID of the game whose API key is to be checked.
 * @returns A promise that resolves to a boolean indicating whether the API key is valid.
 *          If the game is not found, the promise is rejected with an error message.
 */
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