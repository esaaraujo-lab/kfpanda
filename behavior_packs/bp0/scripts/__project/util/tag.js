import { world } from "@minecraft/server";
import { Module } from "noxcrew.common.scripting/index.js";
export class EnablePlayerProperty extends Module {
    constructor(container, property) {
        super(container);
        this.property = property;
    }
    setup() {
        this.listenFor(world.afterEvents.playerSpawn, e => {
            if (!e.initialSpawn)
                return;
            e.player.setProperty(this.property, true);
        });
        this.listenFor(world.beforeEvents.playerLeave, e => {
            e.player.setProperty(this.property, false);
        });
    }
    onActivate() {
        for (const player of world.getPlayers()) {
            player.setProperty(this.property, true);
        }
    }
    onDeactivate() {
        for (const player of world.getPlayers()) {
            player.setProperty(this.property, false);
        }
    }
}
