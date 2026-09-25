import { Module } from "../api/index.js";
/**
 * A module that listens for a single event.
 */
export class SingleEventCallback extends Module {
    constructor(container, signal, callback) {
        super(container);
        this.listenFor(signal, callback);
    }
    setup() {
        // Setup done in ctor to avoid creating unnecessary vars
    }
}
//# sourceMappingURL=singleEventCallback.js.map