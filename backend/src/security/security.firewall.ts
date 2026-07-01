const BLOCKED_PATTERNS = [
    /ignore (previous|above|all|prior) instructions/i,
    /disregard (your|the) (system |previous )?prompt/i,
    /forget (everything|what|your|all)/i,
    /you are now/i,
    /pretend (you are|to be|you're)/i,
    /act as (if|though|a|an)/i,
    /your new (role|persona|identity|instructions)/i,
    /override (your|the) (instructions|rules|constraints)/i,

    /do anything now/i,
    /jailbreak/i,
    /DAN mode/i,
    /developer mode/i,
    /unrestricted mode/i,
    /bypass .{0,20}(prompt|firewall|filter|safety|restriction|instruction)/i,
    /without (any )?(restrictions|limitations|rules|filters)/i,
    /no (restrictions|limitations|rules|filters)/i,

    /roleplay as/i,
    /you('re| are) (a |an )?(different|new|another|evil|uncensored)/i,
    /in this (scenario|story|game|simulation)/i,
    /let's play a game where you/i,
    /hypothetically (speaking)?, (if you|you could|what if)/i,

    /repeat (your|the) (system |initial |original )?(prompt|instructions)/i,
    /what (are|were) your instructions/i,
    /show me your (system |)prompt/i,
    /reveal your (system |)prompt/i,
    /what (is|was) (in )?your context/i,
];

const OFF_TOPIC_PATTERNS = [
    /write (me )?(a |an )?(essay|story|poem|code|script|email)/i,
    /how (do|to) (hack|exploit|crack|bypass)/i,
    /give me (a |)(recipe|joke|song|lyrics)/i,
    /what is the (weather|stock|price|news)/i,
    /translate (this |)(to|into)/i,
    /summarize (this|the following)/i,
];

export interface FirewallResult {
    blocked: boolean;
    reason?: string;
}

export function checkFirewall(input: string): FirewallResult {
    for(const pattern of BLOCKED_PATTERNS){
        if(pattern.test(input)){
            return {blocked: true, reason: "Prompt injection or jailbreak attempt detected."};
        }
    }

    for(const pattern of OFF_TOPIC_PATTERNS){
        if(pattern.test(input)){
            return { blocked: true, reason: "Off-topic request. I only answer questions about Mrinmoy."}
        }
    }

    return {blocked: false};
}
