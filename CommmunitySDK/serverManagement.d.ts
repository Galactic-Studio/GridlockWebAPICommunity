import { branches, sizes } from "./types/enums";
import { headServer } from "./types/objects";
/**
 * Starts a head server service with the specified parameters.
 *
 * @param {string} [name=""] - The name of the server. If not provided, a name will be generated.
 * @param {string} [region="us-east-2"] - The AWS region where the server will be started.
 * @param {branches} [serverBranch=branches.Dev] - The branch of the server to be used.
 * @param {sizes} [size=sizes.Medium] - The size of the server instance.
 * @param {boolean} [allowOther=true] - Whether to allow other connections.
 * @param {string} [dedicatedGameId=""] - The ID of the dedicated game.
 * @returns {{ serverInfo: headServer; promise: Promise<headServer> }} An object containing the server information and a promise that resolves to the server information.
 */
declare function startHeadServerService(name?: string, region?: string, serverBranch?: branches, size?: sizes, allowOther?: boolean, dedicatedGameId?: string): {
    serverInfo: headServer;
    promise: Promise<headServer>;
};
declare function communicateWithHeadServer(serverUrl: string, path: string, message?: {}, method?: string, authCode?: string): Promise<unknown>;
export { startHeadServerService, communicateWithHeadServer };
