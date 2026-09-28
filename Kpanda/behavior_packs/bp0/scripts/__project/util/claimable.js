var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
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
import { Inject, Module, Multimap } from "noxcrew.common.scripting/index.js";
import { EventDispatcher } from "noxcrew.common.scripting/api/events/index.js";
export class ClaimableManager {
    constructor() {
        this.events = new EventDispatcher();
        this.claims = new Multimap();
    }
    emitIfNecessary(key, oldValue, newValue) {
        if (oldValue === newValue)
            return;
        this.events.dispatch({
            key: key,
            oldValue: oldValue?.getValue(),
            newValue: newValue?.getValue(),
        });
    }
    register(claim) {
        this.claims.add(claim.key, claim);
        const lastValue = this.claims.get(claim.key)[0];
        this.claims.get(claim.key)?.sort((a, b) => b.priority - a.priority);
        const newValue = this.claims.get(claim.key)[0];
        this.emitIfNecessary(claim.key, lastValue, newValue);
    }
    unregister(claim) {
        const lastValue = this.claims.get(claim.key)?.[0];
        this.claims.removeValue(claim);
        const newValue = this.claims.get(claim.key)?.[0];
        this.emitIfNecessary(claim.key, lastValue, newValue);
    }
    getValue(key) {
        return this.claims.get(key)?.[0]?.getValue();
    }
}
let Claim = (() => {
    var _a, _Claim_claimableManager_accessor_storage;
    let _classSuper = Module;
    let _instanceExtraInitializers = [];
    let _claimableManager_decorators;
    let _claimableManager_initializers = [];
    return _a = class Claim extends _classSuper {
            get claimableManager() { return __classPrivateFieldGet(this, _Claim_claimableManager_accessor_storage, "f"); }
            set claimableManager(value) { __classPrivateFieldSet(this, _Claim_claimableManager_accessor_storage, value, "f"); }
            constructor(container, key, priority, valueProvider) {
                super(container);
                this.key = (__runInitializers(this, _instanceExtraInitializers), key);
                this.priority = priority;
                this.valueProvider = valueProvider;
                _Claim_claimableManager_accessor_storage.set(this, __runInitializers(this, _claimableManager_initializers, void 0));
            }
            setup() {
            }
            onActivate() {
                this.claimableManager.register(this);
            }
            onDeactivate() {
                this.claimableManager.unregister(this);
            }
            getValue() {
                return this.valueProvider();
            }
        },
        _Claim_claimableManager_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _claimableManager_decorators = [Inject(ClaimableManager)];
            __esDecorate(_a, null, _claimableManager_decorators, { kind: "accessor", name: "claimableManager", static: false, private: false, access: { has: obj => "claimableManager" in obj, get: obj => obj.claimableManager, set: (obj, value) => { obj.claimableManager = value; } }, metadata: _metadata }, _claimableManager_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { Claim };
