import { system } from "@minecraft/server";
import { Module } from "noxcrew.common.scripting/index.js";
export class ScopedTimer extends Module {
    constructor(container, timeout, action, repeating = false) {
        super(container);
        this.timeout = timeout;
        this.action = action;
        this.repeating = repeating;
        this.handle = null;
    }
    setup() { }
    cancel() {
        if (this.handle != null) {
            system.clearRun(this.handle);
        }
        this.handle = null;
    }
    onActivate() {
        this.handle = system[this.repeating ? 'runInterval' : 'runTimeout'](() => this.action(this.cancel.bind(this)), this.timeout);
    }
    onDeactivate() {
        this.cancel();
    }
    static schedule(module, timeout, action, repeating = false) {
        const timer = new ScopedTimer(module.container, timeout, action, repeating);
        module.registerChild(timer);
    }
}
export async function timeout(ticks) {
    await new Promise(r => system.runTimeout(r, ticks));
}
