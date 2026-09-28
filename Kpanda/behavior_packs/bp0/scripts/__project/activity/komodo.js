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
import { Inject, ScopedTimer, SequenceManager, TitleManagerV2 } from "noxcrew.common.scripting/index.js";
import { seqActivityCountdown } from "../sequences.js";
import Activity from "./activity.js";
let KomodoActivity = (() => {
    var _a, _KomodoActivity_sequenceManager_accessor_storage, _KomodoActivity_titleManager_accessor_storage;
    let _classSuper = Activity;
    let _instanceExtraInitializers = [];
    let _sequenceManager_decorators;
    let _sequenceManager_initializers = [];
    let _titleManager_decorators;
    let _titleManager_initializers = [];
    return _a = class KomodoActivity extends _classSuper {
            get sequenceManager() { return __classPrivateFieldGet(this, _KomodoActivity_sequenceManager_accessor_storage, "f"); }
            set sequenceManager(value) { __classPrivateFieldSet(this, _KomodoActivity_sequenceManager_accessor_storage, value, "f"); }
            get titleManager() { return __classPrivateFieldGet(this, _KomodoActivity_titleManager_accessor_storage, "f"); }
            set titleManager(value) { __classPrivateFieldSet(this, _KomodoActivity_titleManager_accessor_storage, value, "f"); }
            constructor(container) {
                super(container, 'KOMODO');
                _KomodoActivity_sequenceManager_accessor_storage.set(this, (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _sequenceManager_initializers, void 0)));
                _KomodoActivity_titleManager_accessor_storage.set(this, __runInitializers(this, _titleManager_initializers, void 0));
                this.wave = 0;
                this.komodosKilled = 0;
                this.ticks = 0;
                this.activityTimer = 0;
            }
            get komodosKilledActionbar() {
                return { actionbar: { rawtext: [{ translate: 'txt.activity_komodo.ab1', with: [String(this.komodosKilled)] }] } };
            }
            async onActivate() {
                super.onActivate();
                await this.sequenceManager.runAndWait(seqActivityCountdown, this);
                for (const group of _a.WAVE_INFO) {
                    this.activityTimer += group.wave_length;
                }
                ScopedTimer.schedule(this, this.activityTimer - 30 * 20, () => {
                    for (const player of world.getAllPlayers()) {
                        player.sendMessage({ translate: 'txt.gs.msg2' });
                        player.playSound('activity_timer_30', { location: player.location });
                    }
                });
                ScopedTimer.schedule(this, 1, () => {
                    this.timer();
                });
                this.actionbarHandle = this.titleManager.addTitle({
                    type: 'persist',
                    weight: 0,
                    components: this.komodosKilledActionbar,
                });
                this.spawnWave();
            }
            onDeactivate() {
                super.onDeactivate();
                this.cleanKomodos();
                this.titleManager.removeTitle(this.actionbarHandle);
            }
            setup() {
                this.listenFor(world.afterEvents.entityDie, e => {
                    if (e.deadEntity.typeId == _a.KOMODO_WARRIOR_ID) {
                        this.komodosKilled++;
                        this.titleManager.replaceTitle(this.actionbarHandle, this.komodosKilledActionbar);
                    }
                    else if (e.deadEntity.typeId == 'minecraft:player') {
                        this.end();
                    }
                });
            }
            spawnWave() {
                for (const player of world.getAllPlayers()) {
                    player.playSound('activity_start', { location: player.location });
                }
                const currentWaveInfo = _a.WAVE_INFO[this.wave];
                for (const group of currentWaveInfo.enemy_groups) {
                    for (let i = 0; i < group.amount; i++) {
                        this.dimension.spawnEntity(_a.KOMODO_WARRIOR_ID, this.randomizePosOffset(group.pos));
                    }
                }
                this.wave++;
                ScopedTimer.schedule(this, currentWaveInfo.wave_length, () => {
                    if (this.wave < _a.WAVE_INFO.length) {
                        this.spawnWave();
                    }
                });
            }
            timer() {
                this.ticks++;
                ScopedTimer.schedule(this, 1, () => {
                    if (this.ticks >= this.activityTimer) {
                        this.cleanKomodos();
                        this.end();
                    }
                    else {
                        this.timer();
                    }
                });
            }
            randomizePosOffset(pos) {
                const offsetPos = { ...pos };
                offsetPos.x += -2 + Math.random() * 5;
                offsetPos.z += -2 + Math.random() * 5;
                return offsetPos;
            }
            cleanKomodos() {
                const removeEntities = this.dimension.getEntities({ families: ['komodo_activity'] });
                removeEntities.forEach(entity => {
                    entity.triggerEvent('noxcrew:despawn');
                });
            }
            endMessage() {
                if (this.ticks >= this.activityTimer) {
                    world.sendMessage({
                        rawtext: [{ translate: 'txt.activity_komodo.complete2', with: [String(this.komodosKilled)] }],
                    });
                }
                else {
                    const mins = Math.floor(this.ticks / 1200);
                    this.ticks = this.ticks % 1200;
                    const secs = Math.floor(this.ticks / 20);
                    this.ticks = this.ticks % 20;
                    const tenthSecs = Math.floor(this.ticks / 2);
                    world.sendMessage({
                        rawtext: [
                            {
                                translate: 'txt.activity_komodo.complete1',
                                with: [`${mins}:${secs.toString().padStart(2, '0')}.${tenthSecs}`, String(this.komodosKilled)],
                            },
                        ],
                    });
                }
                let tier = 'txt.activity_komodo.tier0';
                if (this.komodosKilled >= 30) {
                    tier = 'txt.activity_komodo.tier3';
                }
                else if (this.komodosKilled >= 20) {
                    tier = 'txt.activity_komodo.tier2';
                }
                else if (this.komodosKilled >= 10) {
                    tier = 'txt.activity_komodo.tier1';
                }
                else if (this.komodosKilled != 0) {
                    tier = 'txt.activity_komodo.tier0_1';
                }
                world.sendMessage({ rawtext: [{ translate: `${tier}` }] });
            }
        },
        _KomodoActivity_sequenceManager_accessor_storage = new WeakMap(),
        _KomodoActivity_titleManager_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _sequenceManager_decorators = [Inject(SequenceManager)];
            _titleManager_decorators = [Inject(TitleManagerV2)];
            __esDecorate(_a, null, _sequenceManager_decorators, { kind: "accessor", name: "sequenceManager", static: false, private: false, access: { has: obj => "sequenceManager" in obj, get: obj => obj.sequenceManager, set: (obj, value) => { obj.sequenceManager = value; } }, metadata: _metadata }, _sequenceManager_initializers, _instanceExtraInitializers);
            __esDecorate(_a, null, _titleManager_decorators, { kind: "accessor", name: "titleManager", static: false, private: false, access: { has: obj => "titleManager" in obj, get: obj => obj.titleManager, set: (obj, value) => { obj.titleManager = value; } }, metadata: _metadata }, _titleManager_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a.KOMODO_WARRIOR_ID = 'noxcrew.kp:komodo_warrior',
        _a.WAVE_INFO = [
            {
                enemy_groups: [
                    { amount: 3, pos: { x: 6264, y: 24, z: 2013 } },
                    { amount: 3, pos: { x: 6263, y: 24, z: 2034 } },
                ],
                wave_length: 10 * 20,
            },
            {
                enemy_groups: [
                    { amount: 4, pos: { x: 6253, y: 24, z: 2023 } },
                    { amount: 4, pos: { x: 6274, y: 24, z: 2024 } },
                ],
                wave_length: 20 * 20,
            },
            {
                enemy_groups: [
                    { amount: 3, pos: { x: 6264, y: 24, z: 2013 } },
                    { amount: 3, pos: { x: 6263, y: 24, z: 2034 } },
                    { amount: 3, pos: { x: 6274, y: 24, z: 2024 } },
                ],
                wave_length: 30 * 20,
            },
            {
                enemy_groups: [
                    { amount: 3, pos: { x: 6264, y: 24, z: 2013 } },
                    { amount: 3, pos: { x: 6263, y: 24, z: 2034 } },
                    { amount: 4, pos: { x: 6253, y: 24, z: 2023 } },
                    { amount: 4, pos: { x: 6274, y: 24, z: 2024 } },
                ],
                wave_length: 30 * 20,
            },
            {
                enemy_groups: [
                    { amount: 4, pos: { x: 6264, y: 24, z: 2013 } },
                    { amount: 4, pos: { x: 6263, y: 24, z: 2034 } },
                    { amount: 4, pos: { x: 6253, y: 24, z: 2023 } },
                    { amount: 4, pos: { x: 6274, y: 24, z: 2024 } },
                    { amount: 4, pos: { x: 6264, y: 24, z: 2024 } },
                ],
                wave_length: 60 * 20,
            },
        ],
        _a;
})();
export { KomodoActivity };
