import express, { Express, Request, Response } from "express";
import * as crypto from "node:crypto";
import {requestLevels} from "../types/enums";
import * as headServer from "./headServer"
import * as gameManagement from "./gameManagementService"
require('dotenv').config()

/**
 * Middleware function to check authorization based on the requester type.
 * 
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the stack.
 * 
 * @remarks
 * This function checks the `requester` and `authorization` headers in the request.
 * Depending on the `requester` type, it performs different authorization checks:
 * 
 * - `internal`: Checks internal API key.
 * - `head`: Checks head server authorization.
 * - `child`: Reserved for future implementation.
 * - `game`: Checks game management API key.
 * - `developer`: Checks developer game management API key.
 * 
 * If the authorization is valid, it calls the `next` function to proceed to the next middleware.
 * Otherwise, it sends an appropriate HTTP error response.
 * 
 * @example
 * // Example usage in an Express app
 * app.use(checkAuthorization);
 */
const checkAuthorization = async (req:Request,res:Response,next: () => void)=>{
    const requester = req.headers.requester
    const auth = req.headers.authorization
    console.log("Requester: " + requester)
    switch (requester){
        case requestLevels.internal:
            console.log(checkInternalKey(auth))
            if(await checkInternalKey(auth)){
                next()
            }else if(await checkInternalKey(auth) === null){
                res.status(410).send({Error:"Old internal API Key, send sync code"})
            }else{
                res.status(401).send({Error:"Bad API Key"})
            }
            break
        case requestLevels.head:
            let serverId = Object.values(req.params)[0]
            console.log(serverId)
            if(await headServer.checkHeadAuth(auth, serverId)){
                next()
            }else{
                res.status(401).send({Error:"Bad Auth Code"})
            }
            break
        case requestLevels.child:
            break
        case requestLevels.game:
            let gameID = Object.values(req.params)[0]
            console.log(gameID)
            if (await gameManagement.checkApiKey(auth, gameID)){
                next()
            }else{
                res.status(401).send({Error:"Bad Auth Code"})
            }
            break
        case requestLevels.developer:
            let gameIdDev = Object.values(req.params)[0]
            console.log(gameIdDev)
            if (await gameManagement.checkApiKey(auth,gameIdDev)){
                next()
            }else{
                res.status(401).send({Error:"Bad Auth Code"})
            }
            break
        default:
            res.status(401).send({Error:"No requester header"})
            break
    }
}

/**
 * Checks if the provided key matches the internal API key stored in environment variables.
 *
 * @param key - The key to be checked against the internal API key.
 * @returns `true` if the provided key matches the internal API key, otherwise `false`.
 */
function checkInternalKey(key:string){
    return key === process.env.INTERNAL_APIKEY
}

export {checkAuthorization}