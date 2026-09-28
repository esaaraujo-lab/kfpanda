import { world } from "@minecraft/server";
/**
 * Find player instance given name
 * @param name player's name to find
 * @returns player instance, if one is found
 */
export function GetPlayerFromName(name) {
    return world.getPlayers({ name: name })[0];
}
//# sourceMappingURL=getPlayersName.js.map