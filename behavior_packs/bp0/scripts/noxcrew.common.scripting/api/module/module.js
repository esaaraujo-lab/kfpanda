var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Module_isActive, _Module_childModules;
import { Multimap } from "../util/index.js";
/**
 * A {@link Registerable} implementation with methods for common Bedrock scripting use cases.
 *
 * Event handlers can be registered using {@link listenFor}.
 * {@link onActivate} and {@link onDeactivate} can be used to add custom setup and teardown logic.
 */
export class Module {
    constructor(container) {
        this.container = container;
        /**
         * A map of signals to listener functions.
         * A signal will always be mapped to a contravariant consumer (ensured by logic).
         */
        this.listeners = new Multimap();
        _Module_isActive.set(this, false);
        _Module_childModules.set(this, new Set());
        this.setup();
    }
    /** Override this method to add custom setup logic. */
    onActivate() {
    }
    /** Override this method to add custom teardown logic. */
    onDeactivate() {
    }
    /**
     * Listens for an event, tied to the lifecycle of the module.
     * @param signal the signal to listen for events from
     * @param callback the callback to invoke for the event
     * @protected
     */
    listenFor(signal, callback) {
        this.listeners.add(signal, callback);
        if (this.isActive) {
            signal.subscribe(callback);
        }
    }
    get isActive() {
        return __classPrivateFieldGet(this, _Module_isActive, "f");
    }
    activate() {
        if (__classPrivateFieldGet(this, _Module_isActive, "f"))
            throw new Error('Module is already loaded');
        try {
            this.onActivate();
            this.listeners.forEach((value, key) => {
                for (const callback of value) {
                    key.subscribe(callback);
                }
            });
            __classPrivateFieldSet(this, _Module_isActive, true, "f");
            for (const childModule of __classPrivateFieldGet(this, _Module_childModules, "f")) {
                childModule.activate();
            }
        }
        catch (e) {
            console.error(`Failed to load ${this.constructor.name}. Unloading.`);
            console.error(e);
            this.deactivate();
        }
    }
    deactivate() {
        if (!__classPrivateFieldGet(this, _Module_isActive, "f"))
            throw new Error('Can\'t unload an already unloaded module');
        try {
            this.onDeactivate();
            this.listeners.forEach((value, key) => {
                for (const callback of value) {
                    key.unsubscribe(callback);
                }
            });
            __classPrivateFieldSet(this, _Module_isActive, false, "f");
            for (const childModule of __classPrivateFieldGet(this, _Module_childModules, "f")) {
                childModule.deactivate();
            }
        }
        catch (e) {
            console.error(`Failed to unload ${this.constructor.name}:`);
            console.error(e);
        }
    }
    get children() {
        return __classPrivateFieldGet(this, _Module_childModules, "f");
    }
    /**
     * Registers a module as a child of this module.
     * Its activation state will be synchronised with this module.
     * @param child the module to register
     * @throws Error if the module has already been registered with this module or is already active
     */
    registerChild(child) {
        if (__classPrivateFieldGet(this, _Module_childModules, "f").has(child))
            throw new Error('Can\'t re-register an already registered child module');
        if (child.isActive)
            throw new Error('Can\'t register an already active child module');
        __classPrivateFieldGet(this, _Module_childModules, "f").add(child);
        if (this.isActive) {
            child.activate();
        }
    }
    /**
     * Unregisters a module as a child of this module.
     * Its activation state will be synchronised with this module.
     * @param child the module to unregister
     * @throws Error if the module has already been registered with this module or is already active
     */
    unregisterChild(child) {
        if (!__classPrivateFieldGet(this, _Module_childModules, "f").has(child))
            throw new Error('Can\'t unregister a child module that\'s not registered');
        __classPrivateFieldGet(this, _Module_childModules, "f").delete(child);
        if (child.isActive) {
            child.deactivate();
        }
    }
}
_Module_isActive = new WeakMap(), _Module_childModules = new WeakMap();
//# sourceMappingURL=module.js.map