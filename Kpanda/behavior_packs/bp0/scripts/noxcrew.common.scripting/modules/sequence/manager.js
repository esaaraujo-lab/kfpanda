var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SequenceManager_instances, _SequenceManager_runningSequences, _SequenceManager_callbacks, _SequenceManager_stop;
import { Multimap } from "../../api/index.js";
import { TickingModule } from "../index.js";
import { createTarget } from "./target.js";
import { world } from "@minecraft/server";
/** Manages running sequences */
export class SequenceManager extends TickingModule {
    constructor(container) {
        super(container, 1);
        _SequenceManager_instances.add(this);
        _SequenceManager_runningSequences.set(this, new Set());
        _SequenceManager_callbacks.set(this, new Multimap()
        /**
         * Runs a new sequence from a generator function.
         * @param sequence the sequence to run
         * @param args the arguments for the sequence
         * @return the sequence instance, which can be used to cancel the sequence
         */
        );
    }
    /**
     * Runs a new sequence from a generator function.
     * @param sequence the sequence to run
     * @param args the arguments for the sequence
     * @return the sequence instance, which can be used to cancel the sequence
     */
    run(sequence, ...args) {
        const instance = {
            generator: sequence(...args),
        };
        __classPrivateFieldGet(this, _SequenceManager_runningSequences, "f").add(instance);
        return instance;
    }
    /**
     * Runs a new sequence from a generator function, with a target.
     * @param sequence the sequence to run
     * @param target the target. This is also the sequence's first argument
     * @param args the sequence's remaining arguments
     * @return the sequence instance, which can be used to cancel the sequence
     */
    runFor(sequence, target, ...args) {
        const instance = {
            generator: sequence(target, ...args),
            target: createTarget(target)
        };
        __classPrivateFieldGet(this, _SequenceManager_runningSequences, "f").add(instance);
        return instance;
    }
    /**
     * Waits for a sequence to complete.
     * @param sequence the sequence
     * @return a promise that resolves to true if the sequence completed successfully,
     * or false if the sequence was not running or was cancelled.
     */
    waitFor(sequence) {
        if (!__classPrivateFieldGet(this, _SequenceManager_runningSequences, "f").has(sequence))
            return Promise.resolve(false);
        let complete;
        const promise = new Promise(c => (complete = c));
        __classPrivateFieldGet(this, _SequenceManager_callbacks, "f").add(sequence, complete);
        return promise;
    }
    runAndWait(sequence, ...args) {
        return this.waitFor(this.run(sequence, ...args));
    }
    /** Cancels a sequence. */
    cancel(instance) {
        __classPrivateFieldGet(this, _SequenceManager_instances, "m", _SequenceManager_stop).call(this, instance, false);
    }
    setup() {
        // When a player leaves, cancel all sequences with corresponding player targets.
        this.listenFor(world.afterEvents.playerLeave, e => {
            for (const sequence of __classPrivateFieldGet(this, _SequenceManager_runningSequences, "f")) {
                if (sequence.target?.type !== "player" ||
                    sequence.target.id !== e.playerId)
                    continue;
                __classPrivateFieldGet(this, _SequenceManager_instances, "m", _SequenceManager_stop).call(this, sequence, false);
            }
        });
    }
    tick() {
        for (const sequence of __classPrivateFieldGet(this, _SequenceManager_runningSequences, "f")) {
            if (sequence.generator.next().done == true) {
                __classPrivateFieldGet(this, _SequenceManager_instances, "m", _SequenceManager_stop).call(this, sequence, true);
            }
        }
    }
}
_SequenceManager_runningSequences = new WeakMap(), _SequenceManager_callbacks = new WeakMap(), _SequenceManager_instances = new WeakSet(), _SequenceManager_stop = function _SequenceManager_stop(instance, success) {
    __classPrivateFieldGet(this, _SequenceManager_runningSequences, "f").delete(instance);
    __classPrivateFieldGet(this, _SequenceManager_callbacks, "f").get(instance)?.forEach(callback => callback(success));
};
//# sourceMappingURL=manager.js.map