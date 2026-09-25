import { Module } from "../api/index.js";
import { world } from "@minecraft/server";
/**
 * Invokes an mcfunction when a button is pressed with the given coordinates.
 */
export class InvokeFunctionOnButtonPress extends Module {
    constructor(container, coords, func) {
        super(container);
        this.coords = coords;
        this.func = func;
    }
    setup() {
        this.listenFor(world.afterEvents.buttonPush, e => {
            let { source, block } = e;
            if (!this.coords.some(([x, y, z]) => block.location.x === x && block.location.y === y && block.location.z === z))
                return;
            source.runCommand(`function ${this.func}`);
        });
    }
}
//# sourceMappingURL=invokeFunctionOnButtonPress.js.map