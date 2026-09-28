import { world } from "@minecraft/server";
import { delay } from "noxcrew.common.scripting/index.js";
export function* seqSendDebouncedMessages(tickDelay, ...messages) {
    for (const message of messages) {
        for (const player of world.getAllPlayers()) {
            player.sendMessage(message);
        }
        yield* delay(tickDelay);
    }
}
