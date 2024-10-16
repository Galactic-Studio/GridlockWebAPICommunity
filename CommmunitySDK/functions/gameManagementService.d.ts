import * as objects from "../types/objects";
/**
 * Creates a new game entry in the database with a unique game ID.
 *
 * @param gameInfo - An object containing the game information to be stored.
 * @returns A promise that resolves to the game information object with the newly created game ID.
 */
export declare const createGame: (gameInfo: objects.GameObject) => Promise<unknown>;
/**
 * Checks if the provided API key matches the API key stored for the given game ID.
 *
 * @param apiKey - The API key to be validated.
 * @param gameId - The ID of the game whose API key is to be checked.
 * @returns A promise that resolves to a boolean indicating whether the API key is valid.
 *          If the game is not found, the promise is rejected with an error message.
 */
export declare const checkApiKey: (apiKey: string, gameId: string) => Promise<unknown>;
