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
import { ItemLockMode, ItemStack, Player, system, world } from "@minecraft/server";
import { JoinInProgress } from "./joinInProgress.js";
import { Module, SequenceManager, TitleManagerV2, Inject, property } from "noxcrew.common.scripting/index.js";
import ADMIN_TAG from "./player/disable.js";
import { seqAcademyOpening } from "./sequences.js";
let MapStart = (() => {
    var _a, _MapStart_jip_accessor_storage;
    let _classSuper = Module;
    let _instanceExtraInitializers = [];
    let _jip_decorators;
    let _jip_initializers = [];
    return _a = class MapStart extends _classSuper {
            get jip() { return __classPrivateFieldGet(this, _MapStart_jip_accessor_storage, "f"); }
            set jip(value) { __classPrivateFieldSet(this, _MapStart_jip_accessor_storage, value, "f"); }
            constructor(container) {
                super(container);
                this.sequenceManager = (__runInitializers(this, _instanceExtraInitializers), this.container.inject(SequenceManager));
                this.titleManager = this.container.inject(TitleManagerV2);
                _MapStart_jip_accessor_storage.set(this, __runInitializers(this, _jip_initializers, void 0));
            }
            setup() {
                this.listenFor(system.afterEvents.scriptEventReceive, e => {
                    const MapStarted = world.getDynamicProperty(_a.MAP_STARTED) ?? false;
                    if (e.id == _a.KEY) {
                        if (!MapStarted) {
                            world.setDynamicProperty(_a.MAP_STARTED, 'prologue');
                            this.jip.setLocation(this, 'lee_da_academy', 5);
                            world.getDimension('overworld').runCommandAsync('function music/lee_da_academy');
                            this.sequenceManager.run(seqAcademyOpening, this.titleManager);
                        }
                        else if (e.initiator instanceof Player) {
                            if (MapStarted === 'started')
                                giveTeleportScroll(e.initiator);
                            this.jip.teleport(e.initiator);
                        }
                    }
                    else if (e.id == 'noxcrew.kp:academy_instructor_hint') {
                        this.titleManager.addTitle({
                            type: 'one-off',
                            weight: 2,
                            components: { actionbar: { rawtext: [{ translate: 'txt.gs.msg6' }] } },
                            duration: 300,
                        });
                    }
                });
                this.listenFor(world.afterEvents.playerSpawn, e => {
                    if (!e.initialSpawn)
                        return;
                    const MapStarted = world.getDynamicProperty(_a.MAP_STARTED) ?? false;
                    if (MapStarted === 'started') {
                        giveTeleportScroll(e.player);
                    }
                });
                this.jip.setLocation(this, 'spawn_room');
                if (world.getDynamicProperty(_a.MAP_STARTED) === 'prologue') {
                    this.jip.setLocation(this, 'lee_da_academy', 5);
                }
            }
        },
        _MapStart_jip_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _jip_decorators = [Inject(JoinInProgress)];
            __esDecorate(_a, null, _jip_decorators, { kind: "accessor", name: "jip", static: false, private: false, access: { has: obj => "jip" in obj, get: obj => obj.jip, set: (obj, value) => { obj.jip = value; } }, metadata: _metadata }, _jip_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a.KEY = 'noxcrew.kp:start_map',
        _a.MAP_STARTED = property(_a.KEY),
        _a.LAST_LOCATION_PROPERTY = property('noxcrew.kp:last_location'),
        _a.NOT_ADMIN = { excludeTags: [ADMIN_TAG] },
        _a;
})();
export { MapStart };
export function giveTeleportScroll(player) {
    const teleport_scroll = new ItemStack('noxcrew.kp:teleport_scroll_att');
    teleport_scroll.keepOnDeath = true;
    teleport_scroll.lockMode = ItemLockMode.slot;
    const inventory = player.getComponent('inventory');
    if (!inventory.container)
        return;
    const scrollSlot = inventory.container.getItem(8);
    if (!scrollSlot) {
        inventory.container.setItem(8, teleport_scroll);
    }
}
