import {branches, serverStatus, sizes} from "./types/enums";
import {childServer,headServer} from "./types/objects";
import { EC2Client, RunInstancesCommand, DescribeInstancesCommand, Instance, waitUntilInstanceRunning, CreateKeyPairCommand, DeleteKeyPairCommand} from "@aws-sdk/client-ec2";
import * as CorePG from "./core";
import axios, {AxiosResponse} from "axios";
import crypto from "crypto";
require('dotenv').config()

function startHeadServerService(name:string="",  region:string="us-east-2", serverBranch:branches = branches.Dev, size:sizes = sizes.Medium, allowOther:boolean=true, dedicatedGameId:string=""): { serverInfo: headServer; promise: Promise<headServer> } {
    {
        let serverInfo = <headServer>{}
        serverInfo.name = name || generateServerName()
        serverInfo.serverId = (serverInfo.name + "." + serverBranch + size + crypto.randomBytes(16).toString('hex')).toLowerCase().trim().replaceAll(" ", "").replaceAll("-", ".").replaceAll("\n", "").replaceAll("\r", "");
        serverInfo.branch = serverBranch
        serverInfo.region = region
        serverInfo.size = size
        serverInfo.allowOther = allowOther
        serverInfo.dedicatedGameId = dedicatedGameId
        serverInfo.authCode = crypto.randomBytes(16).toString('hex')
        serverInfo.serverCount = 0
        return {
            serverInfo, promise: new Promise(async (resolve, reject) => {
                const ec2Client = new EC2Client({
                    region: region,
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
                    },
                });
                try {
                    // Create a key pair in Amazon EC2.
                    const {KeyMaterial, KeyName} = await ec2Client.send(
                        // A unique name for the key pair. Up to 255 ASCII characters.
                        new CreateKeyPairCommand({KeyName: serverInfo.serverId.slice(0, 255)}),
                    );
                    // This logs your private key. Be sure to save it.
                    console.log(KeyName);
                    serverInfo.passKey = {
                        passInfo: KeyMaterial,
                        keyName: KeyName
                    }
                    console.log(KeyMaterial);
                } catch (err) {
                    console.error(err);
                }
                const command = new RunInstancesCommand({
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
                        "ssh-keyscan -t rsa github.com >> /root/.ssh/known_hosts\n"+
                        "sudo cat >~/.ssh/config <<EOL\n" +
                        "\n" +
                        "Host GVServer\n" +
                        "Hostname github.com\n" +
                        "User git\n" +
                        "IdentityFile ~/.ssh/id_ed25519\n" +
                        "\n" +
                        "EOL\n"+
                        "\n" +
                        "echo \"SSH key saved\"\n" +
                        "\n" +
                        "# Start ssh-agent and add the key\n" +
                        "eval \"$(ssh-agent -s)\"\n" +
                        "ssh-add /root/.ssh/id_ed25519\n" +
                        "\n" +
                        `git clone -b ${serverInfo.branch} ${process.env.HeadServerGit} /var/www/server \n`+
                        "cd /var/www/server\n" +
                        "\n" +
                        `echo "${serverInfo.authCode}" > /var/www/server/.auth\n`+
                        `echo "${serverInfo.serverId}" > /var/www/server/.server\n`+
                        "\n" +

                        "chmod +x startup.sh\n" +
                        "\n" +
                        "bash startup.sh\n",).toString("base64"),
                    // Ensure only 1 instance launches.
                    MinCount: 1,
                    MaxCount: 1,
                })
                const runResponse = await ec2Client.send(command)
                const instanceId = runResponse.Instances?.[0].InstanceId;
                if (!instanceId) {
                    reject("Instance ID not found in RunInstances response.");
                }
                console.log(`Instance launched with ID: ${instanceId}`);
                serverInfo.status = serverStatus.Starting
                await CorePG.headServerService.createHeadServer(serverInfo)
                // Wait until the instance is running
                await waitUntilInstanceRunning(
                    {client: ec2Client, maxWaitTime: 300}, // maxWaitTime is in seconds
                    {InstanceIds: [instanceId]}
                );

                console.log(`Instance ${instanceId} is now running.`);

                // Retrieve the instance details
                const describeCommand = new DescribeInstancesCommand({InstanceIds: [instanceId]});
                const describeResponse = await ec2Client.send(describeCommand);
                const instance = describeResponse.Reservations?.[0].Instances?.[0];

                if (instance) {
                    console.log(`Instance details:`, instance);
                    console.log(`Public IP address: ${instance.PublicIpAddress}`);
                    serverInfo.ip = instance.PublicIpAddress
                } else {
                    reject("Instance details not found in DescribeInstances response.");
                }
                serverInfo.address = serverInfo.ip + ":" + process.env.HeadServerPort
                serverInfo.status = serverStatus.Ready
                await CorePG.headServerService.createHeadServer(serverInfo)
                resolve(serverInfo)
            })
        }
    }
}

function communicateWithHeadServer(serverUrl:string, path:string, message={}, method:string="GET", authCode:string=""){
    return new Promise(async (resolve, reject) => {
        let request = <AxiosResponse> await axios.request({
            method: method,
            url: `http://${serverUrl}/${path}`,
            headers: {
                'authorization': authCode
            },
            data: {
                message
            }
        }).catch(err => {
            console.warn(err)
        })
        resolve(request)
    })
}

function generateServerName ():string{
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

export {startHeadServerService,communicateWithHeadServer}