import admin from "firebase-admin";
import * as serverManagement from "./serverManagement";
declare function setServiceAccountBackend(serviceAccountPath: string, firebaseDatabaseURL?: string): void;
/**
 * An object representing the database service.
 *
 * @property {typeof games} games - The games service.
 * @property {typeof headServers} headServers - The head servers service.
 * @property {typeof serverManagement} serverManagementService - The server management service.
 */
declare const databaseService: {
    games: admin.firestore.CollectionReference<admin.firestore.DocumentData, admin.firestore.DocumentData>;
    headServers: admin.firestore.CollectionReference<admin.firestore.DocumentData, admin.firestore.DocumentData>;
    serverManagementService: typeof serverManagement;
    setServiceAccountBackend: typeof setServiceAccountBackend;
};
export default databaseService;
