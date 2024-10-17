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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startHeadServerService = startHeadServerService;
exports.communicateWithHeadServer = communicateWithHeadServer;
const enums_1 = require("./types/enums");
const client_ec2_1 = require("@aws-sdk/client-ec2");
const CorePG = __importStar(require("./core"));
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
require('dotenv').config();
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
function startHeadServerService(name = "", region = "us-east-2", serverBranch = enums_1.branches.Dev, size = enums_1.sizes.Medium, allowOther = true, dedicatedGameId = "") {
    {
        let serverInfo = {};
        serverInfo.name = name || generateServerName();
        serverInfo.serverId = (serverInfo.name + "." + serverBranch + size + crypto_1.default.randomBytes(16).toString('hex')).toLowerCase().trim().replaceAll(" ", "").replaceAll("-", ".").replaceAll("\n", "").replaceAll("\r", "");
        serverInfo.branch = serverBranch;
        serverInfo.region = region;
        serverInfo.size = size;
        serverInfo.allowOther = allowOther;
        serverInfo.dedicatedGameId = dedicatedGameId;
        serverInfo.authCode = crypto_1.default.randomBytes(16).toString('hex');
        serverInfo.serverCount = 0;
        return {
            serverInfo, promise: new Promise(async (resolve, reject) => {
                const ec2Client = new client_ec2_1.EC2Client({
                    region: region,
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                    },
                });
                try {
                    // Create a key pair in Amazon EC2.
                    const { KeyMaterial, KeyName } = await ec2Client.send(
                    // A unique name for the key pair. Up to 255 ASCII characters.
                    new client_ec2_1.CreateKeyPairCommand({ KeyName: serverInfo.serverId.slice(0, 255) }));
                    // This logs your private key. Be sure to save it.
                    console.log(KeyName);
                    serverInfo.passKey = {
                        passInfo: KeyMaterial,
                        keyName: KeyName
                    };
                    console.log(KeyMaterial);
                }
                catch (err) {
                    console.error(err);
                }
                const command = new client_ec2_1.RunInstancesCommand({
                    // Your key pair name.
                    TagSpecifications: [
                        {
                            ResourceType: "instance",
                            Tags: [
                                {
                                    Key: "Name",
                                    Value: serverInfo.name, // The name of the server
                                },
                                {
                                    Key: "URL",
                                    Value: serverInfo.serverId + ".galacticstudio.space", // The name of the server
                                },
                            ],
                        },
                    ],
                    KeyName: serverInfo.serverId.slice(0, 255),
                    // Your security group.
                    SecurityGroupIds: ["sg-02a45b5fed3db3b6b"],
                    // An x86_64 compatible image.
                    ImageId: "ami-049d60e41ec849de4", //TODO: update image id to our custom image
                    // An x86_64 compatible free-tier instance type.
                    InstanceType: "t2.micro", //TODO: update workflow to dynamically decide instance type depending on current workload
                    UserData: Buffer.from("#!/bin/bash\n" +
                        "\n" +
                        "# Logging for debugging\n" +
                        "exec > /root/serverStart.out 2>&1\n" +
                        "echo \"Starting user_data script execution\"\n" +
                        "\n" +
                        "# Define the SSH private key\n" +
                        `SSH_KEY="${process.env.GITHUB_HEAD_SERVER_KEY}"` +
                        "\n" +
                        "# Save the SSH private key to a file\n" +
                        "echo \"$SSH_KEY\" > /root/.ssh/id_ed25519\n" +
                        "chmod 600 /root/.ssh/id_ed25519\n" +
                        "ssh-keyscan -t rsa github.com >> /root/.ssh/known_hosts\n" +
                        "sudo cat >~/.ssh/config <<EOL\n" +
                        "\n" +
                        "Host GVServer\n" +
                        "Hostname github.com\n" +
                        "User git\n" +
                        "IdentityFile ~/.ssh/id_ed25519\n" +
                        "\n" +
                        "EOL\n" +
                        "\n" +
                        "echo \"SSH key saved\"\n" +
                        "\n" +
                        "# Start ssh-agent and add the key\n" +
                        "eval \"$(ssh-agent -s)\"\n" +
                        "ssh-add /root/.ssh/id_ed25519\n" +
                        "\n" +
                        `git clone -b ${serverInfo.branch} ${process.env.GITHUB_HEAD_GIT} /var/www/server \n` +
                        "cd /var/www/server\n" +
                        "\n" +
                        `echo "${serverInfo.authCode}" > /var/www/server/.auth\n` +
                        `echo "${serverInfo.serverId}" > /var/www/server/.server\n` +
                        "\n" +
                        "chmod +x startup.sh\n" +
                        "\n" +
                        "bash startup.sh\n").toString("base64"),
                    // Ensure only 1 instance launches.
                    MinCount: 1,
                    MaxCount: 1,
                });
                const runResponse = await ec2Client.send(command);
                const instanceId = runResponse.Instances?.[0].InstanceId;
                if (!instanceId) {
                    reject("Instance ID not found in RunInstances response.");
                }
                console.log(`Instance launched with ID: ${instanceId}`);
                serverInfo.status = enums_1.serverStatus.Starting;
                await CorePG.headServerService.createHeadServer(serverInfo);
                // Wait until the instance is running
                await (0, client_ec2_1.waitUntilInstanceRunning)({ client: ec2Client, maxWaitTime: 300 }, // maxWaitTime is in seconds
                { InstanceIds: [instanceId] });
                console.log(`Instance ${instanceId} is now running.`);
                // Retrieve the instance details
                const describeCommand = new client_ec2_1.DescribeInstancesCommand({ InstanceIds: [instanceId] });
                const describeResponse = await ec2Client.send(describeCommand);
                const instance = describeResponse.Reservations?.[0].Instances?.[0];
                if (instance) {
                    console.log(`Instance details:`, instance);
                    console.log(`Public IP address: ${instance.PublicIpAddress}`);
                    serverInfo.ip = instance.PublicIpAddress;
                }
                else {
                    reject("Instance details not found in DescribeInstances response.");
                }
                serverInfo.address = serverInfo.ip + ":" + process.env.DEFAULT_HEADSERVER_PORT;
                serverInfo.status = enums_1.serverStatus.Ready;
                await CorePG.headServerService.createHeadServer(serverInfo);
                resolve(serverInfo);
            })
        };
    }
}
function communicateWithHeadServer(serverUrl, path, message = {}, method = "GET", authCode = "") {
    return new Promise(async (resolve, reject) => {
        let request = await axios_1.default.request({
            method: method,
            url: `http://${serverUrl}/${path}`,
            headers: {
                'authorization': authCode
            },
            data: {
                message
            }
        }).catch(err => {
            console.warn(err);
        });
        resolve(request);
    });
}
function generateServerName() {
    const spaceTerms = [
        'Galaxy', 'Nebula', 'Comet', 'Asteroid', 'Cosmos', 'Orbit', 'Nova', 'Pulsar', 'Quasar', 'Solar',
        'Hole', 'Supernova', 'Meteor', 'Exoplanet', 'Wormhole', 'Star', 'Singularity',
        'Planetary', 'Eclipse', 'Matter', 'Horizon', 'Gravity', 'Radiation Belt',
        'Magnetosphere', 'Cloud', 'Stellar', 'Ion', 'Protostar', 'Kuiper'
    ];
    const planetNames = [
        'Mercurius', 'Venus', 'Terra', 'Mars', 'Iuppiter', 'Saturnus', 'Uranus', 'Neptunus',
        'Pluto', 'Ceres', 'Haumea', 'Makemake', 'Eris', 'Vulcan', 'Apollo', 'Minerva',
        'Juno', 'Vesta', 'Hebe', 'Iris', 'Orcus', 'Sedna', 'Quaoar', 'Varuna'
    ];
    const adjectives = [
        'Prime', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota',
        'Lambda', 'Kappa', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau',
        'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'Nova', 'Centauri', 'Major', 'Minor', 'Supreme'
    ];
    const spaceIndex = Math.floor(Math.random() * spaceTerms.length);
    const planetIndex = Math.floor(Math.random() * planetNames.length);
    const adjectiveIndex = Math.floor(Math.random() * adjectives.length);
    // Form the server name
    return `${spaceTerms[spaceIndex]}-${planetNames[planetIndex]}-${adjectives[adjectiveIndex]}`;
}
