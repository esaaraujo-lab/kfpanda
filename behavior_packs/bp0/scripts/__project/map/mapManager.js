import { system, world } from "@minecraft/server";
import { Module } from "noxcrew.common.scripting/index.js";
export const MAP_LOCATIONS = {
    NONE: null,
    JADE_PALACE: 'noxcrew:map_jade_palace',
    PEACE_VALLEY: 'noxcrew:map_peace_valley',
    GONGMEN_CITY: 'noxcrew:map_gongmen_city',
    PANDA_VILLAGE: 'noxcrew:map_panda_village',
    JUNIPER_CITY: 'noxcrew:map_juniper_city',
};
export class MapManager extends Module {
    setup() {
        this.listenFor(system.afterEvents.scriptEventReceive, e => {
            if (e.id != 'noxcrew:give_map' || !e.sourceEntity || !e.message)
                return;
            MapManager.updateMap(e.sourceEntity, e.message);
        });
    }
    static updateMap(player, map, dimension = world.getDimension('overworld')) {
        player.runCommand('clear @s filled_map');
        if (map == MAP_LOCATIONS.NONE)
            return;
        player.runCommand(`structure load ${MAP_LOCATIONS[map]} ~ ~ ~`);
    }
}
