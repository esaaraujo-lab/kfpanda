import { system } from "@minecraft/server";
import { Module } from "../api/index.js";
/**
 * A module that runs a tick loop at a specified tickrate interval.
 */
export class TickingModule extends Module {
    constructor(container, tickInterval) {
        super(container);
        this.tickInterval = tickInterval;
    }
    /** This method is not used by {@link TickingModule} and may be overridden. */
    setup() { }
    onActivate() {
        this.handle = system.runInterval(this.tick.bind(this), this.tickInterval);
    }
    /** Must be invoked by subclasses. */
    onDeactivate() {
        if (this.handle != null) {
            system.clearRun(this.handle);
            this.handle = undefined;
        }
    }
}
//# sourceMappingURL=tickingModule.js.map