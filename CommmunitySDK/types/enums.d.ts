/**
 * Enum representing different levels of requests within the system.
 *
 * @enum {string}
 * @property {string} developer - Represents a developer level request.
 * @property {string} head - Represents a head level request.
 * @property {string} child - Represents a child level request.
 * @property {string} internal - Represents an internal level request.
 * @property {string} game - Represents a game level request.
 */
declare enum requestLevels {
    developer = "developer",
    head = "head",
    child = "child",
    internal = "internal",
    game = "game"
}
/**
 * Enum representing different types of servers.
 *
 * @enum {string}
 * @property {string} peer - Represents a peer-to-peer server.
 * @property {string} dedicated - Represents a dedicated server.
 */
declare enum serverTypes {
    peer = "p2p",
    dedicated = "dedicated"
}
/**
 * Enum representing the different branches in the development lifecycle.
 *
 * @enum {string}
 * @property {string} Dev - Represents the development branch.
 * @property {string} Beta - Represents the beta testing branch.
 * @property {string} PreRelease - Represents the pre-release branch.
 * @property {string} Release - Represents the final release branch.
 */
declare enum branches {
    Dev = "dev",
    Beta = "beta",
    PreRelease = "prerelease",
    Release = "release"
}
/**
 * Enum representing different server sizes.
 *
 * @enum {string}
 *
 * @property {string} Small - Represents a small server configuration with 4 vCPUs and 8GB of RAM.
 * @property {string} Medium - Represents a medium server configuration with 4 vCPUs and 16GB of RAM (AMD).
 * @property {string} CPUOptimized - Represents a CPU optimized server configuration with 8 vCPUs.
 * @property {string} Large - Represents a large server configuration with 8 vCPUs, 32GB of RAM, and 640GB of storage (Intel).
 * @property {string} Fast - Represents a fast server configuration with 16 vCPUs and 32GB of RAM.
 *
 * @remarks
 * Community SDK users need to update these enums to their needs.
 */
declare enum sizes {
    Small = "s-4vcpu-8gb",
    Medium = "s-4vcpu-16gb-amd",
    CPUOptimized = "c-8",
    Large = "s-8vcpu-32gb-640gb-intel",
    Fast = "c2-16vcpu-32gb"
}
/**
 * Enum representing the various statuses a server can have.
 *
 * @enum {string}
 * @property {string} Starting - The server is in the process of starting up.
 * @property {string} Full - The server is currently full and cannot accept more connections.
 * @property {string} Ready - The server is ready and available for connections.
 * @property {string} Quiting - The server is in the process of shutting down.
 */
declare enum serverStatus {
    Starting = "Starting",
    Full = "Full",//
    Ready = "Ready",
    Quiting = "Quiting"
}
export { requestLevels, serverTypes, branches, sizes, serverStatus };
