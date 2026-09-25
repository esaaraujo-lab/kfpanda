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
import { BossFightStage } from "../stage.js";
import { Inject, TitleManagerV2 } from "noxcrew.common.scripting/index.js";
import { RemoveEntityFamily, RemoveEntityType } from "../../util/removeEntity.js";
import { createTaiLungS1Sequence } from "./cutscenes.js";
export function preLoadTaiStage1() {
    const BRAZIER_LOCATIONS = [
        { x: 183, y: 56, z: 8052 },
        { x: 183, y: 56, z: 8040 },
        { x: 190, y: 56, z: 8040 },
        { x: 190, y: 56, z: 8052 },
        { x: 197, y: 56, z: 8040 },
        { x: 197, y: 56, z: 8052 },
        { x: 204, y: 56, z: 8040 },
        { x: 204, y: 56, z: 8052 },
    ];
    const BRAZIER_ENTITY_ID = 'noxcrew.kp:brazier';
    for (const brazier of BRAZIER_LOCATIONS) {
        let brazierEntity = world.getDimension('overworld').spawnEntity(BRAZIER_ENTITY_ID, { x: 0, y: 0, z: 0 });
        brazierEntity.teleport(brazier);
    }
}
let TaiLungStage1 = (() => {
    var _a, _TaiLungStage1_titleManager_accessor_storage;
    let _classSuper = BossFightStage;
    let _instanceExtraInitializers = [];
    let _titleManager_decorators;
    let _titleManager_initializers = [];
    return _a = class TaiLungStage1 extends _classSuper {
            constructor() {
                super(...arguments);
                _TaiLungStage1_titleManager_accessor_storage.set(this, (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _titleManager_initializers, void 0)));
                this.startSequence = createTaiLungS1Sequence(this.titleManager);
                this.fightLocation = 'tai_lung_1';
            }
            get titleManager() { return __classPrivateFieldGet(this, _TaiLungStage1_titleManager_accessor_storage, "f"); }
            set titleManager(value) { __classPrivateFieldSet(this, _TaiLungStage1_titleManager_accessor_storage, value, "f"); }
            resetStage() {
                RemoveEntityFamily(['tai_lung_fight']);
            }
            setupStage() {
                world.getDimension('overworld').runCommandAsync(`function music/BOSS_TAI_1`);
                world.getDimension('overworld').runCommandAsync(`structure load noxcrew:door2_0 217 55 8042`);
                RemoveEntityType(_a.TAILUNG_ENTITY_CUTSCENE);
                world
                    .getDimension('overworld')
                    .spawnEntity(_a.TAILUNG_ENTITY, { x: 173, y: 56, z: 8046 })
                    .triggerEvent('noxcrew:start_phase.1');
                this.titleManager.addTitle({
                    type: 'one-off',
                    duration: 60,
                    weight: 0,
                    components: { actionbar: { rawtext: [{ translate: `txt.boss_tai.ab1` }] } },
                });
                world.sendMessage({ translate: 'txt.boss_tai.context1' });
            }
            setup() {
                this.listenFor(world.afterEvents.entityDie, e => {
                    const deadBoss = e.deadEntity.typeId;
                    if (deadBoss !== _a.TAILUNG_ENTITY)
                        return;
                    this.finishStage();
                });
            }
        },
        _TaiLungStage1_titleManager_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _titleManager_decorators = [Inject(TitleManagerV2)];
            __esDecorate(_a, null, _titleManager_decorators, { kind: "accessor", name: "titleManager", static: false, private: false, access: { has: obj => "titleManager" in obj, get: obj => obj.titleManager, set: (obj, value) => { obj.titleManager = value; } }, metadata: _metadata }, _titleManager_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a.TAILUNG_ENTITY = 'noxcrew.kp:tai_lung',
        _a.TAILUNG_ENTITY_CUTSCENE = 'noxcrew.kp:tai_lung_cutscene',
        _a;
})();
export { TaiLungStage1 };
