import databaseService from "../database";
import * as objects from "../types/objects";
import * as enums from "../types/enums";
import admin from "firebase-admin";
import crypto from "crypto";

/**
 * Generates a unique ID and checks its existence in the specified Firestore collection.
 * If the generated ID does not exist in the collection, it resolves with the ID.
 *
 * @param {admin.firestore.CollectionReference<admin.firestore.DocumentData, admin.firestore.DocumentData>} collection - The Firestore collection reference to check the ID against.
 * @param {number} count - The length of the ID to be generated.
 * @returns A promise that resolves with a unique ID string.
 */
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

/**
 * Generates a random code of the specified length and returns it as a string in the specified encoding.
 *
 * @param {number} length - The length of the random code to generate.
 * @param {BufferEncoding} returnType - The encoding to use for the returned string. Must be a valid `BufferEncoding`.
 * @returns A random code as a string in the specified encoding.
 */
export const createCode =(length:number, returnType:BufferEncoding)=>{
    return crypto.randomBytes(length).toString(returnType)
}
