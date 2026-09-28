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
import { world } from "@minecraft/server";
import { BossFightStage } from "../stage.js";
import { Inject, TitleManagerV2 } from "noxcrew.common.scripting/index.js";
import { RemoveEntityFamily, RemoveEntityType } from "../../util/removeEntity.js";
import { createTaiLungS2Sequence, TaiLungEndFight } from "./cutscenes.js";
import { stringToVector3 } from "../../util/stringToVector3.js";
function preLoadStage() { }
let TaiLungStage2 = (() => {
    var _a, _TaiLungStage2_titleManager_accessor_storage;
    let _classSuper = BossFightStage;
    let _instanceExtraInitializers = [];
    let _titleManager_decorators;
    let _titleManager_initializers = [];
    return _a = class TaiLungStage2 extends _classSuper {
            constructor() {
                super(...arguments);
                this.dimension = (__runInitializers(this, _instanceExtraInitializers), world.getDimension('overworld'));
                _TaiLungStage2_titleManager_accessor_storage.set(this, __runInitializers(this, _titleManager_initializers, void 0));
                this.startSequence = createTaiLungS2Sequence(this.titleManager, this.sequenceManager);
                this.fightLocation = 'tai_lung_2';
            }
            get titleManager() { return __classPrivateFieldGet(this, _TaiLungStage2_titleManager_accessor_storage, "f"); }
            set titleManager(value) { __classPrivateFieldSet(this, _TaiLungStage2_titleManager_accessor_storage, value, "f"); }
            resetStage() {
                RemoveEntityFamily(['tai_lung_fight']);
            }
            setupStage() {
                world.getDimension('overworld').runCommandAsync(`function music/BOSS_TAI_2`);
                RemoveEntityType(_a.TAILUNG_ENTITY_CUTSCENE);
                let taiLung = this.dimension.spawnEntity(_a.TAILUNG_ENTITY, { x: 387, y: -36, z: 10110 });
                taiLung.triggerEvent('noxcrew:start_phase.2');
                for (const wok_piles of _a.WOK_PILE_LOCATIONS) {
                    let wokPilesEntity = world
                        .getDimension('overworld')
                        .spawnEntity(_a.WOK_PILE_ENTITY, { x: 398, y: -36, z: 10110 });
                    wokPilesEntity.teleport(wok_piles);
                }
                for (const firework_cart of _a.FIREWORK_CART_LOCATIONS) {
                    let fireworkCartEntity = world
                        .getDimension('overworld')
                        .spawnEntity(_a.FIREWORK_CART_ENTITY, { x: 398, y: -36, z: 10110 });
                    fireworkCartEntity.teleport(firework_cart, { rotation: { y: 180, x: 0 } });
                }
                this.titleManager.addTitle({
                    type: 'one-off',
                    duration: 60,
                    weight: 0,
                    components: { actionbar: { rawtext: [{ translate: `txt.boss_tai.ab2` }] } },
                });
                world.sendMessage({ translate: 'txt.boss_tai.context2' });
            }
            setup() {
                this.listenFor(world.afterEvents.entityDie, e => {
                    const deadBoss = e.deadEntity.typeId;
                    if (deadBoss !== _a.TAILUNG_ENTITY)
                        return;
                    this.finishStage();
                });
            }
            async onFinishStage() {
                await this.sequenceManager.runAndWait(TaiLungEndFight, this.titleManager);
                for (const player of world.getAllPlayers())
                    player.teleport(stringToVector3('339 -48 62'));
            }
        },
        _TaiLungStage2_titleManager_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _titleManager_decorators = [Inject(TitleManagerV2)];
            __esDecorate(_a, null, _titleManager_decorators, { kind: "accessor", name: "titleManager", static: false, private: false, access: { has: obj => "titleManager" in obj, get: obj => obj.titleManager, set: (obj, value) => { obj.titleManager = value; } }, metadata: _metadata }, _titleManager_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a.TAILUNG_ENTITY = 'noxcrew.kp:tai_lung',
        _a.TAILUNG_ENTITY_CUTSCENE = 'noxcrew.kp:tai_lung_cutscene',
        _a.WOK_PILE_ENTITY = 'noxcrew.kp:wok_pile',
        _a.FIREWORK_CART_ENTITY = 'noxcrew.kp:firework_cart',
        _a.WOK_PILE_LOCATIONS = [
            { x: 379, y: -35, z: 10099 },
            { x: 399, y: -36, z: 10119 },
            { x: 411, y: -36, z: 10101 },
        ],
        _a.FIREWORK_CART_LOCATIONS = [{ x: 394, y: -36, z: 10131 }],
        _a;
})();
export { TaiLungStage2 };
