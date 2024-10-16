"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCode = exports.createAndCheckId = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generates a unique ID and checks its existence in the specified Firestore collection.
 * If the generated ID does not exist in the collection, it resolves with the ID.
 *
 * @param {admin.firestore.CollectionReference<admin.firestore.DocumentData, admin.firestore.DocumentData>} collection - The Firestore collection reference to check the ID against.
 * @param {number} count - The length of the ID to be generated.
 * @returns A promise that resolves with a unique ID string.
 */
const createAndCheckId = (collection, count) => {
    return new Promise(async (resolve) => {
        while (true) {
            let id = (0, exports.createCode)(count, 'hex');
            if (collection === null || !(await collection.doc(id).get()).exists) {
                resolve(id);
                break;
            }
        }
    });
};
exports.createAndCheckId = createAndCheckId;
/**
 * Generates a random code of the specified length and returns it as a string in the specified encoding.
 *
 * @param {number} length - The length of the random code to generate.
 * @param {BufferEncoding} returnType - The encoding to use for the returned string. Must be a valid `BufferEncoding`.
 * @returns A random code as a string in the specified encoding.
 */
const createCode = (length, returnType) => {
    return crypto_1.default.randomBytes(length).toString(returnType);
};
exports.createCode = createCode;
