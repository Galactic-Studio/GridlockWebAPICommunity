import express, { Express, Request, Response } from "express";
import * as crypto from "node:crypto";
import {requestLevels} from "../types/enums";
import * as headServer from "./headServer"
import * as gameManagement from "./gameManagementService"
require('dotenv').config()

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

function checkInternalKey(key:string){
    return key === process.env.INTERNAL_APIKEY
}

export {checkAuthorization}