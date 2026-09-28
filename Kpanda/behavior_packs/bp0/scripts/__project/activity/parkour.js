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
import { DynamicProperty, SequenceManager, ScopedTimer, Inject, TitleManagerV2, } from "noxcrew.common.scripting/index.js";
import { seqActivityCountdown } from "../sequences.js";
import { stringToVector3 } from "../util/stringToVector3.js";
import { TreeSling } from "../player/treeSling.js";
import Activity from "./activity.js";
let ParkourActivity = (() => {
    var _a, _ParkourActivity_sequenceManager_accessor_storage, _ParkourActivity_titleManager_accessor_storage;
    let _classSuper = Activity;
    let _instanceExtraInitializers = [];
    let _sequenceManager_decorators;
    let _sequenceManager_initializers = [];
    let _titleManager_decorators;
    let _titleManager_initializers = [];
    return _a = class ParkourActivity extends _classSuper {
            get sequenceManager() { return __classPrivateFieldGet(this, _ParkourActivity_sequenceManager_accessor_storage, "f"); }
            set sequenceManager(value) { __classPrivateFieldSet(this, _ParkourActivity_sequenceManager_accessor_storage, value, "f"); }
            get titleManager() { return __classPrivateFieldGet(this, _ParkourActivity_titleManager_accessor_storage, "f"); }
            set titleManager(value) { __classPrivateFieldSet(this, _ParkourActivity_titleManager_accessor_storage, value, "f"); }
            constructor(container) {
                super(container, 'PARKOUR');
                _ParkourActivity_sequenceManager_accessor_storage.set(this, (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _sequenceManager_initializers, void 0)));
                _ParkourActivity_titleManager_accessor_storage.set(this, __runInitializers(this, _titleManager_initializers, void 0));
                this.score = 0;
                this.roundID = (_a.PARKOURID_STORAGE.get(world) ?? 0) + 1;
                this.totalDumplings = _a.DUMPLING_LOCATIONS.length;
            }
            async onActivate() {
                super.onActivate();
                await this.sequenceManager.runAndWait(seqActivityCountdown, this);
                _a.PARKOURID_STORAGE.set(world, this.roundID);
                this.tryDespawnAllParkourEntities(this.roundID);
                this.actionbarHandle = this.titleManager.addTitle({
                    type: 'persist',
                    weight: 0,
                    components: this.dumplingsCollectedActionbar,
                });
                for (const dumpLoc of _a.DUMPLING_LOCATIONS) {
                    const dump = this.dimension.spawnEntity(_a.DUMPLING_ENTITY_ID, { x: 0, y: 0, z: 0 });
                    _a.PARKOURID_STORAGE.set(dump, this.roundID);
                    dump.teleport(stringToVector3(dumpLoc));
                }
                for (const slingLoc of _a.TREE_SLING_LOCATIONS) {
                    const sling = this.dimension.spawnEntity(TreeSling.SLING_ENTITY_ID, { x: 0, y: 0, z: 0 });
                    _a.PARKOURID_STORAGE.set(sling, this.roundID);
                    sling.teleport(stringToVector3(slingLoc.coords), { rotation: { x: 0, y: slingLoc.rotation } });
                }
                ScopedTimer.schedule(this, _a.TIMER_LENGTH, () => this.end());
                ScopedTimer.schedule(this, _a.TIMER_LENGTH - 600, () => {
                    for (const player of world.getAllPlayers()) {
                        player.sendMessage({ translate: 'txt.gs.msg2' });
                        player.playSound('activity_timer_30', { location: player.location });
                    }
                });
            }
            onDeactivate() {
                super.onDeactivate();
                this.titleManager.removeTitle(this.actionbarHandle);
                this.tryDespawnAllParkourEntities(this.roundID + 1);
            }
            setup() {
                this.listenFor(system.afterEvents.scriptEventReceive, e => {
                    if (e.id == 'noxcrew.kp:dumpling_collect' && e.sourceEntity) {
                        this.score++;
                        this.titleManager.replaceTitle(this.actionbarHandle, this.dumplingsCollectedActionbar);
                        e.sourceEntity.onScreenDisplay.setTitle(`nox:popup_dumpling`);
                        if (this.score >= this.totalDumplings) {
                            this.end();
                        }
                    }
                });
                this.listenFor(world.afterEvents.entityLoad, e => {
                    if (e.entity.typeId != (_a.DUMPLING_ENTITY_ID || TreeSling.SLING_ENTITY_ID)) {
                        return;
                    }
                    this.tryDespawn(e.entity, this.roundID);
                });
            }
            get dumplingsCollectedActionbar() {
                return { actionbar: { rawtext: [{ translate: 'txt.activity_parkour.counter', with: [String(this.score)] }] } };
            }
            endMessage() {
                const parkourResultMsg = {
                    translate: `txt.activity_parkour.counter`,
                    with: [`${this.score}`],
                };
                world.sendMessage(parkourResultMsg);
                let tier = 'txt.activity_parkour.tier0';
                if (this.score >= this.totalDumplings * 0.5) {
                    tier = 'txt.activity_parkour.tier3';
                }
                else if (this.score >= this.totalDumplings * 0.3) {
                    tier = 'txt.activity_parkour.tier2';
                }
                else if (this.score >= this.totalDumplings * 0.1) {
                    tier = 'txt.activity_parkour.tier1';
                }
                else if (this.score != 0) {
                    tier = 'txt.activity_parkour.tier0_1';
                }
                world.sendMessage({ rawtext: [{ translate: `${tier}` }] });
            }
            tryDespawnAllParkourEntities(roundID) {
                for (const parkourEntites of world.getDimension('overworld').getEntities({
                    families: ['activity_parkour'],
                })) {
                    this.tryDespawn(parkourEntites, roundID);
                }
            }
            tryDespawn(entity, roundID) {
                const parkourID = _a.PARKOURID_STORAGE.get(entity);
                if (parkourID != roundID) {
                    entity.triggerEvent('noxcrew:despawn');
                }
            }
        },
        _ParkourActivity_sequenceManager_accessor_storage = new WeakMap(),
        _ParkourActivity_titleManager_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _sequenceManager_decorators = [Inject(SequenceManager)];
            _titleManager_decorators = [Inject(TitleManagerV2)];
            __esDecorate(_a, null, _sequenceManager_decorators, { kind: "accessor", name: "sequenceManager", static: false, private: false, access: { has: obj => "sequenceManager" in obj, get: obj => obj.sequenceManager, set: (obj, value) => { obj.sequenceManager = value; } }, metadata: _metadata }, _sequenceManager_initializers, _instanceExtraInitializers);
            __esDecorate(_a, null, _titleManager_decorators, { kind: "accessor", name: "titleManager", static: false, private: false, access: { has: obj => "titleManager" in obj, get: obj => obj.titleManager, set: (obj, value) => { obj.titleManager = value; } }, metadata: _metadata }, _titleManager_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a.PARKOURID_STORAGE = new DynamicProperty('noxcrew.kp:parkour_id'),
        _a.TIMER_LENGTH = 3000,
        _a.DUMPLING_ENTITY_ID = 'noxcrew.kp:dragon_warrior_dumpling',
        _a.DUMPLING_LOCATIONS = [
            '4035.5 120 2152.5',
            '4043.5 125 2144.5',
            '4048.5 126 2135.5',
            '4048.5 131 2118.5',
            '4055.5 132 2103.5',
            '4065.5 138 2094.5',
            '4073.5 143 2097.5',
            '4092.5 142 2097.5',
            '4111.5 142 2097.5',
            '4126.5 143 2097.5',
            '4133.5 149 2095.5',
            '4137.5 162 2100.5',
            '4137.5 166 2112.5',
            '4135.5 171 2134.5',
            '4146.5 176 2134.5',
            '4156.5 172 2147.5',
            '4157.5 177 2157.5',
            '4151.5 169 2166.5',
            '4149.5 169 2182.5',
            '4139.5 168 2184.5',
            '4037.5 125 2170.5',
            '4051.5 126 2178.5',
            '4062.5 130 2182.5',
            '4080.5 133 2191.5',
            '4091.5 135 2181.5',
            '4100.5 135 2169.5',
            '4107.5 135 2173.5',
            '4107.5 135 2179.5',
            '4107.5 135 2185.5',
            '4113.5 139 2165.5',
            '4119.5 143 2185.5',
            '4120.5 140 2156.5',
            '4113.5 129 2154.5',
            '4097.5 126 2150.5',
            '4083.5 126 2139.5',
            '4071.5 125 2153.5',
            '4053.5 123 2153.5',
            '4115.5 125 2137.5',
            '4115.5 135 2124.5',
            '4116.5 144 2114.5',
            '4119.5 142 2144.5',
            '4111.5 155 2167.5',
            '4105.5 163 2180.5',
            '4096.5 162 2191.5',
            '4130.5 162 2177.5',
            '4141.5 156 2174.5',
            '4148.5 154 2165.5',
            '4137.5 143 2146.5',
            '4133.5 137 2160.5',
            '4117.5 129 2158.5',
            '4072.5 125 2128.5',
            '4083.5 129 2119.5',
            '4104.5 123 2122.5',
            '4105.5 123 2136.5',
            '4077.5 127 2171',
            '4077.5 127 2177',
            '4077.5 127 2183',
        ],
        _a.TREE_SLING_LOCATIONS = [
            { coords: '4048.5 125 2124.5', rotation: 0 },
            { coords: '4129.5 142 2095.5', rotation: 90 },
            { coords: '4135.5 148 2093.5', rotation: 90 },
            { coords: '4137.5 154 2096.5', rotation: 180 },
            { coords: '4147.5 147 2163.5', rotation: 180 },
            { coords: '4062.5 124 2180.5', rotation: 180 },
        ],
        _a;
})();
export { ParkourActivity };
