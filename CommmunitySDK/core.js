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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setServiceAccount = exports.headServerMangement = exports.playerManagementService = exports.gameManagementService = exports.gameServerService = exports.utilities = exports.headServerService = void 0;
const headServerService = __importStar(require("./functions/headServer"));
exports.headServerService = headServerService;
const utilities = __importStar(require("./functions/util"));
exports.utilities = utilities;
const gameServerService = __importStar(require("./functions/gameServer"));
exports.gameServerService = gameServerService;
const gameManagementService = __importStar(require("./functions/gameManagementService"));
exports.gameManagementService = gameManagementService;
const playerManagementService = __importStar(require("./functions/playerManagementService"));
exports.playerManagementService = playerManagementService;
const headServerMangement = __importStar(require("./serverManagement"));
exports.headServerMangement = headServerMangement;
const databaseManagement = __importStar(require("./database"));
/**
 * Sets the service account for the backend.
 *
 * This function is a reference to the `setServiceAccountBackend` method from the `databaseManagement` object.
 *
 * @param {string} accountName - The name of the service account to set.
 * @param {string} accountKey - The key associated with the service account.
 * @returns {Promise<void>} A promise that resolves when the service account is successfully set.
 */
const setServiceAccount = databaseManagement.default.setServiceAccountBackend;
exports.setServiceAccount = setServiceAccount;
