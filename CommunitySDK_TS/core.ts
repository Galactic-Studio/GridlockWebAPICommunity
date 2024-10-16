import * as headServerService from "./functions/headServer"
import * as utilities from "./functions/util"
import * as gameServerService from "./functions/gameServer"
import * as gameManagementService from "./functions/gameManagementService"
import * as playerManagementService from "./functions/playerManagementService"
import * as headServerMangement from "./serverManagement"
import * as databaseManagement from "./database"


/**
 * Sets the service account for the backend.
 *
 * This function is a reference to the `setServiceAccountBackend` method from the `databaseManagement` object.
 *
 * @param {string} accountName - The name of the service account to set.
 * @param {string} accountKey - The key associated with the service account.
 * @returns {Promise<void>} A promise that resolves when the service account is successfully set.
 */
const setServiceAccount = databaseManagement.default.setServiceAccountBackend

export {
    headServerService,
    utilities,
    gameServerService,
    gameManagementService,
    playerManagementService,
    headServerMangement,
    setServiceAccount
}
