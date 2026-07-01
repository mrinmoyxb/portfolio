import { SSMClient, GetParametersByPathCommand } from "@aws-sdk/client-ssm";

const client = new SSMClient({region: "ap-south-1"});

export async function loadSecrets(): Promise<void> {
    const command = new GetParametersByPathCommand({
        Path: "/portfolio",
        WithDecryption: true,
        Recursive: true
    });

    const response = await client.send(command);

    for(const param of response.Parameters ?? []){
        const key = param.Name!.split("/").pop()!;
        process.env[key] = param.Value!;
    }

    console.log("✅ Keys loaded from AWS SSM");
}