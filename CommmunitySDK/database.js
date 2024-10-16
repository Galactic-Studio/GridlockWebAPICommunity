"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
const serverManagement = __importStar(require("./serverManagement"));
function setServiceAccountBackend(serviceAccountPath, firebaseDatabaseURL) {
    const serviceAccount = require(serviceAccountPath);
    try {
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(serviceAccount),
            databaseURL: firebaseDatabaseURL || process.env.FIREBASE_DATABASE_URL
        });
        console.log("Firebase initialization successful");
    }
    catch (error) {
        console.error("Error initializing Firebase:", error);
    }
}
const database = (0, firestore_1.getFirestore)();
const headServers = database.collection("headServers");
const games = database.collection("games");
/**
 * An object representing the database service.
 *
 * @property {typeof games} games - The games service.
 * @property {typeof headServers} headServers - The head servers service.
 * @property {typeof serverManagement} serverManagementService - The server management service.
 */
const databaseService = {
    games: games,
    headServers: headServers,
    serverManagementService: serverManagement,
    setServiceAccountBackend: setServiceAccountBackend
};
exports.default = databaseService;
