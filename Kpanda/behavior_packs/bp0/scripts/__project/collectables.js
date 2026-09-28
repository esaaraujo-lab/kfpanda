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
import { system, world } from "@minecraft/server";
import { Inject, Module, SequenceManager, property, throwErr } from "noxcrew.common.scripting/index.js";
import { seqSendDebouncedMessages } from "./util/debouncedMessage.js";
import { timeout } from "./util/timer.js";
const COLLECTABLES = {
    palace: ['sacred_dragon_scroll', 'sacred_hammer'],
    peace: ['battle_helmets', 'crossbow', 'dolphin_armor', 'rhino_armor', 'soh'],
    gongmen: ['golden_spear', 'rickshaw', 'ring_blades', 'tea_set', 'trident'],
    panda: ['egg', 'fan', 'iron_fist', 'shield', 'urn'],
    harbor: ['dagger', 'ninja_weapons', 'ostrich', 'pangolin', 'warhammer'],
};
const ALL_COLLECTABLES = Object.values(COLLECTABLES).flat();
let CollectablesModule = (() => {
    var _a, _CollectablesModule_sequenceManager_accessor_storage;
    let _classSuper = Module;
    let _instanceExtraInitializers = [];
    let _sequenceManager_decorators;
    let _sequenceManager_initializers = [];
    return _a = class CollectablesModule extends _classSuper {
            constructor() {
                super(...arguments);
                _CollectablesModule_sequenceManager_accessor_storage.set(this, (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _sequenceManager_initializers, void 0)));
                this.foundCollectables = JSON.parse(world.getDynamicProperty(_a.STORAGE_PROPERTY) ?? '[]');
            }
            get sequenceManager() { return __classPrivateFieldGet(this, _CollectablesModule_sequenceManager_accessor_storage, "f"); }
            set sequenceManager(value) { __classPrivateFieldSet(this, _CollectablesModule_sequenceManager_accessor_storage, value, "f"); }
            static getEntityCollectableType(e) {
                if (e.typeId.startsWith(_a.ENTITY_PREFIX) !== true)
                    throwErr(`${e.id} is not a collectable`);
                const collectableType = e.typeId.substring(_a.ENTITY_PREFIX.length);
                if (!ALL_COLLECTABLES.includes(collectableType)) {
                    throw new Error(`Unknown collectable ${collectableType}`);
                }
                return collectableType;
            }
            save() {
                world.setDynamicProperty(_a.STORAGE_PROPERTY, JSON.stringify(this.foundCollectables));
            }
            collect(collectable) {
                if (this.foundCollectables.includes(collectable))
                    return;
                this.foundCollectables.push(collectable);
                this.save();
                for (const entity of world.getDimension('overworld').getEntities({
                    type: _a.ENTITY_PREFIX + collectable,
                })) {
                    if (!entity.getProperty(_a.PODIUM_PROPERTY))
                        continue;
                    entity.setProperty('noxcrew:collectable', true);
                    entity.runCommand(`dialogue change @s noxcrew.kp:collectible.${collectable}`);
                }
                const area = Object.entries(COLLECTABLES).find(([areaName, collectibles]) => collectibles.includes(collectable))?.[0];
                if (area == undefined)
                    throw new Error(`Couldn't find collectible area for ${collectable}`);
                const collectingText = [];
                collectingText.push({ translate: `txt.co.${collectable}` });
                for (const player of world.getAllPlayers()) {
                    player.onScreenDisplay.setActionBar([{ rawtext: [{ translate: `txt.co_ab.${collectable}` }] }]);
                }
                if (COLLECTABLES[area].every(x => this.foundCollectables.includes(x))) {
                    collectingText.push({ translate: `txt.gs.${area}` });
                }
                if (this.isCompleted()) {
                    collectingText.push({ translate: `txt.gs.all` });
                    for (const player of world.getAllPlayers())
                        player.playSound('po_good_job', { location: player.location, volume: 5 });
                }
                this.sequenceManager.run(seqSendDebouncedMessages, 100, ...collectingText);
            }
            isCompleted() {
                if (ALL_COLLECTABLES.length === this.foundCollectables.length) {
                    return true;
                }
                return false;
            }
            async celebrate(pos) {
                world.getDimension('overworld').runCommand(`particle noxcrew.kp:celebration_fireworks ${pos.x} ${pos.y} ${pos.z}`);
                for (let i = 0; i < 10; i++) {
                    await timeout(10);
                    world.playSound('firework.large_blast', pos);
                }
            }
            setup() {
                this.listenFor(system.afterEvents.scriptEventReceive, e => {
                    if (e.id !== _a.COLLECT_EVENT)
                        return;
                    const entity = e.sourceEntity;
                    if (entity == undefined)
                        return;
                    const collectableType = _a.getEntityCollectableType(entity);
                    this.collect(collectableType);
                    if (this.isCompleted()) {
                        this.celebrate(entity.location);
                    }
                });
                this.listenFor(world.afterEvents.entityLoad, e => {
                    if (!e.entity.typeId.startsWith(_a.ENTITY_PREFIX) ||
                        !e.entity.getProperty(_a.PODIUM_PROPERTY))
                        return;
                    const collectable = _a.getEntityCollectableType(e.entity);
                    const hasBeenFound = this.foundCollectables.includes(collectable);
                    e.entity.setProperty('noxcrew:collectable', hasBeenFound);
                    if (hasBeenFound) {
                        e.entity.runCommand(`dialogue change @s noxcrew.kp:collectible.${collectable}`);
                    }
                });
            }
        },
        _CollectablesModule_sequenceManager_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _sequenceManager_decorators = [Inject(SequenceManager)];
            __esDecorate(_a, null, _sequenceManager_decorators, { kind: "accessor", name: "sequenceManager", static: false, private: false, access: { has: obj => "sequenceManager" in obj, get: obj => obj.sequenceManager, set: (obj, value) => { obj.sequenceManager = value; } }, metadata: _metadata }, _sequenceManager_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a.STORAGE_PROPERTY = property('noxcrew.kp:collectables'),
        _a.PODIUM_PROPERTY = property('noxcrew:podium'),
        _a.ENTITY_PREFIX = 'noxcrew.kp:collect_',
        _a.COLLECT_EVENT = 'noxcrew.kp:collectable_collect',
        _a;
})();
export { CollectablesModule };
