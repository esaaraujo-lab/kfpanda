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
import { Inject, Module, SequenceManager } from "noxcrew.common.scripting/index.js";
import { JoinInProgress } from "../joinInProgress.js";
import { world } from "@minecraft/server";
let BossFightStage = (() => {
    var _a, _BossFightStage_jip_accessor_storage;
    let _classSuper = Module;
    let _instanceExtraInitializers = [];
    let _jip_decorators;
    let _jip_initializers = [];
    return _a = class BossFightStage extends _classSuper {
            get jip() { return __classPrivateFieldGet(this, _BossFightStage_jip_accessor_storage, "f"); }
            set jip(value) { __classPrivateFieldSet(this, _BossFightStage_jip_accessor_storage, value, "f"); }
            constructor(container, bossFight) {
                super(container);
                this.bossFight = (__runInitializers(this, _instanceExtraInitializers), bossFight);
                this.sequenceManager = this.container.inject(SequenceManager);
                _BossFightStage_jip_accessor_storage.set(this, __runInitializers(this, _jip_initializers, void 0));
            }
            async startStage() {
                world.getDimension('overworld').runCommandAsync('function music/stop');
                this.resetStage();
                await this.sequenceManager.runAndWait(this.startSequence, this);
                this.jip.setLocation(this, this.fightLocation, 30, true);
                this.setupStage();
            }
            finishStage() {
                this.bossFight.nextStage();
            }
            async onFinishStage() {
                world.getDimension('overworld').runCommandAsync('function music/BOSS_stop');
            }
        },
        _BossFightStage_jip_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _jip_decorators = [Inject(JoinInProgress)];
            __esDecorate(_a, null, _jip_decorators, { kind: "accessor", name: "jip", static: false, private: false, access: { has: obj => "jip" in obj, get: obj => obj.jip, set: (obj, value) => { obj.jip = value; } }, metadata: _metadata }, _jip_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { BossFightStage };
