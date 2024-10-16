import admin from "firebase-admin";
import { getFirestore } from 'firebase-admin/firestore';
import * as serverManagement from "./serverManagement";

const serviceAccount = require("./firebaseSDKKey.json");

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    console.log("Firebase initialization successful");
} catch (error) {
    console.error("Error initializing Firebase:", error);
}

const database = getFirestore();
const headServers = database.collection("headServers")
const games = database.collection("games")

const databaseService = {
    games: games,
    headServers: headServers,
    serverManagementService: serverManagement,
}

export default databaseService