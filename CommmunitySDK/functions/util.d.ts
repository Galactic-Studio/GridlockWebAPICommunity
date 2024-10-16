import admin from "firebase-admin";
/**
 * Generates a unique ID and checks its existence in the specified Firestore collection.
 * If the generated ID does not exist in the collection, it resolves with the ID.
 *
 * @param {admin.firestore.CollectionReference<admin.firestore.DocumentData, admin.firestore.DocumentData>} collection - The Firestore collection reference to check the ID against.
 * @param {number} count - The length of the ID to be generated.
 * @returns A promise that resolves with a unique ID string.
 */
export declare const createAndCheckId: (collection: admin.firestore.CollectionReference<admin.firestore.DocumentData, admin.firestore.DocumentData>, count: number) => Promise<string>;
/**
 * Generates a random code of the specified length and returns it as a string in the specified encoding.
 *
 * @param {number} length - The length of the random code to generate.
 * @param {BufferEncoding} returnType - The encoding to use for the returned string. Must be a valid `BufferEncoding`.
 * @returns A random code as a string in the specified encoding.
 */
export declare const createCode: (length: number, returnType: BufferEncoding) => string;
