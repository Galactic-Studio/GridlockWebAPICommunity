enum  requestLevels  {
    developer="developer",
    head="head",
    child="child",
    internal= "internal",
    game= "game"
}

enum  serverTypes {
    peer= "p2p",
    dedicated= "dedicated"
}

enum  branches  {
    Dev= "dev", 
    Beta= "beta",
    PreRelease= "prerelease",
    Release= "release"
}

enum sizes  { //TODO: Community SDK users need to update these enums to their needs.
    Small= "s-4vcpu-8gb",
    Medium= "s-4vcpu-16gb-amd",
    CPUOptimized= "c-8",
    Large= "s-8vcpu-32gb-640gb-intel",
    Fast= "c2-16vcpu-32gb"
}

enum serverStatus  {
    Starting= "Starting",
    Full= "Full", //
    Ready= "Ready",
    Quiting= "Quiting"
}


export {
    requestLevels,
    serverTypes,
    branches,
    sizes,
    serverStatus
}
