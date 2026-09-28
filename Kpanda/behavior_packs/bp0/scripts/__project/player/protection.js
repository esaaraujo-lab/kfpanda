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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
import { world } from "@minecraft/server";
import { Inject, TickingModule } from "noxcrew.common.scripting/index.js";
import ADMIN_TAG from "./disable.js";
import { stringToVector3 } from "../util/stringToVector3.js";
import { JoinInProgress } from "../joinInProgress.js";
import { Vector3Utils } from "../util/math/vectorUtils.js";
let PlayerProtectionManager = (() => {
    var _a, _PlayerProtectionManager_jip_accessor_storage;
    let _classSuper = TickingModule;
    let _instanceExtraInitializers = [];
    let _jip_decorators;
    let _jip_initializers = [];
    return _a = class PlayerProtectionManager extends _classSuper {
            constructor(container) {
                super(container, 4);
                _PlayerProtectionManager_jip_accessor_storage.set(this, (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _jip_initializers, void 0)));
            }
            get jip() { return __classPrivateFieldGet(this, _PlayerProtectionManager_jip_accessor_storage, "f"); }
            set jip(value) { __classPrivateFieldSet(this, _PlayerProtectionManager_jip_accessor_storage, value, "f"); }
            tick() {
                for (const player of world.getAllPlayers()) {
                    if (player.hasTag(ADMIN_TAG))
                        continue;
                    const getBlock = player.dimension.getBlock(player.location);
                    if (!getBlock)
                        return;
                    const block = getBlock.below(1);
                    if (!block)
                        return;
                    if (block.permutation.matches('barrier')) {
                        const loc = this.jip.getCurrentLocation();
                        if (!loc)
                            return;
                        const dir = Vector3Utils.subtract(PROTECTION_RETURNS[loc], player.location);
                        player.applyKnockback(dir.x, dir.z, 0.6, 1.1);
                    }
                }
            }
        },
        _PlayerProtectionManager_jip_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _jip_decorators = [Inject(JoinInProgress)];
            __esDecorate(_a, null, _jip_decorators, { kind: "accessor", name: "jip", static: false, private: false, access: { has: obj => "jip" in obj, get: obj => obj.jip, set: (obj, value) => { obj.jip = value; } }, metadata: _metadata }, _jip_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a.JUMP_STRENGTH = 1.1,
        _a;
})();
export { PlayerProtectionManager };
const PROTECTION_RETURNS = {
    spawn_room: stringToVector3('0 0 0'),
    lee_da_academy: stringToVector3('-1940 255 89'),
    jade_palace: stringToVector3('101 155 101'),
    peace_valley: stringToVector3('101 155 101'),
    gongmen_city: stringToVector3('2176 28 227'),
    panda_village: stringToVector3('4059 201 162'),
    juniper_harbor: stringToVector3('6167 138 177'),
    juniper_castle: stringToVector3('6167 138 177'),
    tai_lung_1: stringToVector3('0 0 0'),
    tai_lung_2: stringToVector3('0 0 0'),
    lord_shen_1: stringToVector3('0 0 0'),
    lord_shen_2: stringToVector3('0 0 0'),
    general_kai_1: stringToVector3('0 0 0'),
    general_kai_2: stringToVector3('4072 72 7984'),
    chameleon_1: stringToVector3('0 0 0'),
    chameleon_2: stringToVector3('0 0 0'),
    chameleon_3: stringToVector3('0 0 0'),
    tut_training: stringToVector3('0 0 0'),
    tut_munching: stringToVector3('0 0 0'),
    tut_wolf_peace: stringToVector3('0 0 0'),
    tut_wolf_city: stringToVector3('0 0 0'),
    tut_dumpling_parkour: stringToVector3('0 0 0'),
    tut_dumpling_cooking: stringToVector3('0 0 0'),
    tut_noodle_cooking: stringToVector3('0 0 0'),
    tut_komodo_fight: stringToVector3('0 0 0'),
    training_hall: stringToVector3('0 0 0'),
    dragon_suit_munching: stringToVector3('0 0 0'),
    wolf_thieves_peace: stringToVector3('0 0 0'),
    wolf_thieves_city: stringToVector3('0 0 0'),
    dumpling_parkour: stringToVector3('4105 200 2152'),
    dumpling_cooking: stringToVector3('0 0 0'),
    noodle_cooking: stringToVector3('0 0 0'),
    komodo_fight: stringToVector3('0 0 0'),
};
