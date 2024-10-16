import { Request, Response } from "express";
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
declare const checkAuthorization: (req: Request, res: Response, next: () => void) => Promise<void>;
export { checkAuthorization };
