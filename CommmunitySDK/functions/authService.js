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
exports.checkAuthorization = void 0;
const enums_1 = require("../types/enums");
const headServer = __importStar(require("./headServer"));
const gameManagement = __importStar(require("./gameManagementService"));
require('dotenv').config();
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
const checkAuthorization = async (req, res, next) => {
    const requester = req.headers.requester;
    const auth = req.headers.authorization;
    console.log("Requester: " + requester);
    switch (requester) {
        case enums_1.requestLevels.internal:
            console.log(checkInternalKey(auth));
            if (await checkInternalKey(auth)) {
                next();
            }
            else if (await checkInternalKey(auth) === null) {
                res.status(410).send({ Error: "Old internal API Key, send sync code" });
            }
            else {
                res.status(401).send({ Error: "Bad API Key" });
            }
            break;
        case enums_1.requestLevels.head:
            let serverId = Object.values(req.params)[0];
            console.log(serverId);
            if (await headServer.checkHeadAuth(auth, serverId)) {
                next();
            }
            else {
                res.status(401).send({ Error: "Bad Auth Code" });
            }
            break;
        case enums_1.requestLevels.child:
            break;
        case enums_1.requestLevels.game:
            let gameID = Object.values(req.params)[0];
            console.log(gameID);
            if (await gameManagement.checkApiKey(auth, gameID)) {
                next();
            }
            else {
                res.status(401).send({ Error: "Bad Auth Code" });
            }
            break;
        case enums_1.requestLevels.developer:
            let gameIdDev = Object.values(req.params)[0];
            console.log(gameIdDev);
            if (await gameManagement.checkApiKey(auth, gameIdDev)) {
                next();
            }
            else {
                res.status(401).send({ Error: "Bad Auth Code" });
            }
            break;
        default:
            res.status(401).send({ Error: "No requester header" });
            break;
    }
};
exports.checkAuthorization = checkAuthorization;
/**
 * Checks if the provided key matches the internal API key stored in environment variables.
 *
 * @param key - The key to be checked against the internal API key.
 * @returns `true` if the provided key matches the internal API key, otherwise `false`.
 */
function checkInternalKey(key) {
    return key === process.env.INTERNAL_APIKEY;
}
