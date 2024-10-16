import databaseService from "../database";
import * as objects from "../types/objects";
import * as enums from "../types/enums";
import admin from "firebase-admin";
import crypto from "crypto";

export const createAndCheckId = (collection:admin.firestore.CollectionReference<admin.firestore.DocumentData, admin.firestore.DocumentData>, count:number)=>{
    return new Promise<string>(async (resolve) => {
        while (true)  {
            let id = createCode(count, 'hex');
            if(collection===null || !(await collection.doc(id).get()).exists){
                resolve(id)
                break
            }
        }
    })
}

export const createCode =(length:number, returnType:BufferEncoding)=>{
    return crypto.randomBytes(length).toString(returnType)
}