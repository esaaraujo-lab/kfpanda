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
import { Player, world } from "@minecraft/server";
import { CookingActivity } from "../activity/cooking.js";
import { DragonActivity } from "../activity/dragon.js";
import { KomodoActivity } from "../activity/komodo.js";
import { ParkourActivity } from "../activity/parkour.js";
import { TrainingActivity } from "../activity/training.js";
import { WolfActivity } from "../activity/wolf.js";
import { ChameleonFight } from "../bossFights/chameleon/fight.js";
import { GeneralKaiFight } from "../bossFights/generalKai/fight.js";
import { LordShenFight } from "../bossFights/lordShen/fight.js";
import { TaiLungFight } from "../bossFights/taiLung/fight.js";
import { Inject, Module, ScopedTimer, TitleManagerV2, property, } from "noxcrew.common.scripting/index.js";
import { stringToVector3 } from "../util/stringToVector3.js";
import { JoinInProgress } from "../joinInProgress.js";
import { EventDispatcher } from "noxcrew.common.scripting/api/events/index.js";
import { MapManager } from "../map/mapManager.js";
import { timeout } from "../util/timer.js";
import { RemoveEntityFamily } from "../util/removeEntity.js";
const GAMES = {
    PARKOUR: c => new ParkourActivity(c),
    COOKING_DUMPLINGS: c => new CookingActivity(c, 'COOKING_DUMPLINGS'),
    COOKING_NOODLES: c => new CookingActivity(c, 'COOKING_NOODLES'),
    TRAINING: c => new TrainingActivity(c),
    WOLF_GONGMEN: c => new WolfActivity(c, 'WOLF_GONGMEN'),
    WOLF_PEACE: c => new WolfActivity(c, 'WOLF_PEACE'),
    DRAGON_DANCE: c => new DragonActivity(c),
    KOMODO: c => new KomodoActivity(c),
    BOSS_TAI: c => new TaiLungFight(c),
    BOSS_SHEN: c => new LordShenFight(c),
    BOSS_KAI: c => new GeneralKaiFight(c),
    BOSS_CHAMELEON: c => new ChameleonFight(c),
};
const BOSSES = ['BOSS_TAI', 'BOSS_SHEN', 'BOSS_KAI', 'BOSS_CHAMELEON'];
export const GAME_LOCATIONS = {
    PARKOUR: {
        returnLocation: '4033 120 162',
        returnMap: 'PANDA_VILLAGE',
        rotation: -90,
        offsetSpawn: true,
        jipLocation: 'dumpling_parkour',
        jipReturn: 'panda_village',
        itemsToClear: [],
    },
    COOKING_DUMPLINGS: {
        returnLocation: '4067 127 109',
        returnMap: 'PANDA_VILLAGE',
        rotation: 0,
        offsetSpawn: true,
        jipLocation: 'dumpling_cooking',
        jipReturn: 'panda_village',
        itemsToClear: [
            'noxcrew.kp:dumpling_bowl',
            'noxcrew.kp:dumpling_bowl_bamboo',
            'noxcrew.kp:dumpling_bowl_radish',
            'noxcrew.kp:bamboo_shoots',
            'noxcrew.kp:chopped_bamboo_shoots',
            'noxcrew.kp:red_radish',
            'noxcrew.kp:chopped_red_radish',
        ],
    },
    COOKING_NOODLES: {
        returnLocation: '514 -52 27',
        returnMap: 'PEACE_VALLEY',
        rotation: 0,
        offsetSpawn: true,
        jipLocation: 'noodle_cooking',
        jipReturn: 'peace_valley',
        itemsToClear: [
            'noxcrew.kp:noodle_bowl',
            'noxcrew.kp:noodle_bowl_daikon',
            'noxcrew.kp:noodle_bowl_pak_choi',
            'noxcrew.kp:daikon',
            'noxcrew.kp:chopped_daikon',
            'noxcrew.kp:pak_choi',
            'noxcrew.kp:chopped_pak_choi',
        ],
    },
    TRAINING: {
        returnLocation: '106 74 216',
        returnMap: 'JADE_PALACE',
        rotation: 0,
        offsetSpawn: true,
        jipLocation: 'training_hall',
        jipReturn: 'jade_palace',
        itemsToClear: [],
    },
    WOLF_GONGMEN: {
        returnLocation: '2137 -38 180',
        returnMap: 'GONGMEN_CITY',
        rotation: 90,
        offsetSpawn: true,
        jipLocation: 'wolf_thieves_city',
        jipReturn: 'gongmen_city',
        itemsToClear: ['noxcrew.kp:axe'],
    },
    WOLF_PEACE: {
        returnLocation: '513 -53 92',
        returnMap: 'PEACE_VALLEY',
        rotation: 90,
        offsetSpawn: true,
        jipLocation: 'wolf_thieves_peace',
        jipReturn: 'peace_valley',
        itemsToClear: ['noxcrew.kp:wok'],
    },
    DRAGON_DANCE: {
        returnLocation: '2092 -33 236',
        returnMap: 'GONGMEN_CITY',
        rotation: -90,
        offsetSpawn: true,
        jipLocation: 'dragon_suit_munching',
        jipReturn: 'gongmen_city',
        itemsToClear: [],
    },
    KOMODO: {
        returnLocation: '6214 117 247',
        returnMap: 'JUNIPER_CITY',
        rotation: 0,
        offsetSpawn: true,
        jipLocation: 'komodo_fight',
        jipReturn: 'juniper_castle',
        itemsToClear: ['noxcrew.kp:fireworks'],
    },
    BOSS_TAI: {
        returnLocation: '337 -48 62',
        returnMap: 'PEACE_VALLEY',
        rotation: 0,
        offsetSpawn: false,
        jipLocation: 'tai_lung_1',
        jipReturn: 'peace_valley',
        itemsToClear: ['noxcrew.kp:wok'],
    },
    BOSS_SHEN: {
        returnLocation: '2309 -38 255',
        returnMap: 'GONGMEN_CITY',
        rotation: 0,
        offsetSpawn: false,
        jipLocation: 'lord_shen_1',
        jipReturn: 'gongmen_city',
        itemsToClear: ['noxcrew.kp:axe'],
    },
    BOSS_KAI: {
        returnLocation: '4075 126 169',
        returnMap: 'PANDA_VILLAGE',
        rotation: 0,
        offsetSpawn: false,
        jipLocation: 'general_kai_1',
        jipReturn: 'panda_village',
        itemsToClear: ['noxcrew.kp:fireworks', 'noxcrew.kp:dragon_spirit'],
    },
    BOSS_CHAMELEON: {
        returnLocation: '6205 117 247',
        returnMap: 'JUNIPER_CITY',
        rotation: 0,
        offsetSpawn: false,
        jipLocation: 'chameleon_1',
        jipReturn: 'juniper_castle',
        itemsToClear: ['noxcrew.kp:rubble_throwable'],
    },
};
let GameManager = (() => {
    var _a, _GameManager_jip_accessor_storage;
    let _classSuper = Module;
    let _instanceExtraInitializers = [];
    let _jip_decorators;
    let _jip_initializers = [];
    return _a = class GameManager extends _classSuper {
            constructor() {
                super(...arguments);
                this.JIP_PROPERTY = (__runInitializers(this, _instanceExtraInitializers), property('noxcrew.common.scripting:jip'));
                this.titleManager = this.container.inject(TitleManagerV2);
                this.events = new EventDispatcher();
                _GameManager_jip_accessor_storage.set(this, __runInitializers(this, _jip_initializers, void 0));
                this.driverId = undefined;
            }
            get jip() { return __classPrivateFieldGet(this, _GameManager_jip_accessor_storage, "f"); }
            set jip(value) { __classPrivateFieldSet(this, _GameManager_jip_accessor_storage, value, "f"); }
            get currentRunningGame() {
                return this.currentGameModule;
            }
            async startGame(game, driverId = undefined) {
                if (this.currentGame != null) {
                    return;
                    throw new Error('Cannot register a game while another one is already running!');
                }
                try {
                    world.setDynamicProperty(_a.GAME_STORAGE, game);
                    this.currentGame = game;
                    this.currentGameModule = GAMES[game](this.container);
                    this.driverId = driverId;
                    await timeout(20);
                    this.jipClaim = this.jip.setLocation(this, GAME_LOCATIONS[game].jipLocation, 20, true);
                    for (const player of world.getAllPlayers()) {
                        player.setRotation({ x: 0, y: GAME_LOCATIONS[game].rotation });
                        MapManager.updateMap(player, 'NONE');
                    }
                    this.registerChild(this.currentGameModule);
                    this.events.dispatch({
                        type: 'started',
                        game,
                    });
                }
                catch (e) {
                }
            }
            static offsetSpawn(pos, rad) {
                return {
                    x: Math.floor(pos.x) - rad + Math.floor(Math.random() * (rad * 2 + 1)) + 0.5,
                    y: pos.y,
                    z: Math.floor(pos.z) - rad + Math.floor(Math.random() * (rad * 2 + 1)) + 0.5,
                };
            }
            async endGame() {
                await this.playersAlive();
                const game = world.getDynamicProperty(_a.GAME_STORAGE);
                if (game == undefined || game === 'NONE')
                    return;
                if (BOSSES.includes(game)) {
                    RemoveEntityFamily(['tai_lung_fight']);
                    RemoveEntityFamily(['lord_shen_fight']);
                    RemoveEntityFamily(['kai_fight']);
                    RemoveEntityFamily(['chameleon_fight']);
                }
                if (!!this.jipClaim) {
                    this.unregisterChild(this.jipClaim);
                }
                world.setTimeOfDay(6000);
                for (const player of world.getAllPlayers()) {
                    const health = player.getComponent('minecraft:health');
                    health.resetToMaxValue();
                    MapManager.updateMap(player, GAME_LOCATIONS[this.currentGame ?? 'TRAINING'].returnMap);
                }
                for (const item of GAME_LOCATIONS[this.currentGame ?? 'TRAINING'].itemsToClear) {
                    world.getDimension('overworld').runCommand(`clear @a ${item}`);
                }
                let driver = undefined;
                if (this.driverId != undefined) {
                    driver = world.getEntity(this.driverId);
                }
                if (driver instanceof Player) {
                    driver.runCommand(`scriptevent noxcrew.kp:open_game_menu ${this.currentGame}`);
                }
                else {
                    let returnLocation = { x: 0, y: 0, z: 0 };
                    let returnMap = 'NONE';
                    if (this.currentGame != undefined) {
                        returnLocation = stringToVector3(GAME_LOCATIONS[this.currentGame].returnLocation);
                        returnMap = GAME_LOCATIONS[this.currentGame].returnMap;
                    }
                    for (const player of world.getAllPlayers()) {
                        player.camera.fade({
                            fadeColor: { blue: 0.09, red: 0.109, green: 0.09 },
                            fadeTime: {
                                fadeInTime: 0.75,
                                fadeOutTime: 0.75,
                                holdTime: 1,
                            },
                        });
                    }
                    ScopedTimer.schedule(this, 15, () => {
                        const location = this.jip.getCurrentLocation();
                        for (const player of world.getAllPlayers()) {
                            player.runCommandAsync('gamemode adventure');
                            player.runCommandAsync('inputpermission set @s movement enabled');
                            player.runCommandAsync('inputpermission set @s camera enabled');
                            player.camera.clear;
                            player.setDynamicProperty(this.JIP_PROPERTY, location);
                            player.teleport(_a.offsetSpawn(returnLocation, 2));
                            player.setSpawnPoint({
                                dimension: world.getDimension('overworld'),
                                ...returnLocation,
                            });
                        }
                        this.titleManager.addTitle({
                            type: 'one-off',
                            duration: 1,
                            weight: 0,
                            components: { title: { text: 'nox:letterbox_out' } },
                        });
                        this.events.dispatch({
                            type: 'ended',
                            game,
                        });
                    });
                }
                world.setDynamicProperty(_a.GAME_STORAGE, 'NONE');
                this.currentGame = undefined;
                this.driverId = undefined;
                if (this.currentGameModule == undefined)
                    return;
                this.unregisterChild(this.currentGameModule);
                this.currentGameModule = undefined;
            }
            setup() {
                this.listenFor(world.afterEvents.playerSpawn, ({ player, initialSpawn }) => {
                    player.setDynamicProperty('noxcrew.kp:dead', false);
                    if (!initialSpawn)
                        return;
                    if (!player.getDynamicProperty('noxcrew.kp:dead'))
                        player.setDynamicProperty('noxcrew.kp:dead', false);
                    const game = world.getDynamicProperty(_a.GAME_STORAGE);
                    if (game == undefined || game === 'NONE')
                        return;
                    this.startGame(game);
                });
                this.listenFor(world.afterEvents.entityDie, e => {
                    if (e.deadEntity instanceof Player) {
                        const player = e.deadEntity;
                        player.setDynamicProperty('noxcrew.kp:dead', true);
                    }
                });
            }
            async playersAlive() {
                for (const player of world.getAllPlayers()) {
                    while (player.getDynamicProperty('noxcrew.kp:dead')) {
                        await timeout(20);
                    }
                }
            }
            onActivate() { }
        },
        _GameManager_jip_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _jip_decorators = [Inject(JoinInProgress)];
            __esDecorate(_a, null, _jip_decorators, { kind: "accessor", name: "jip", static: false, private: false, access: { has: obj => "jip" in obj, get: obj => obj.jip, set: (obj, value) => { obj.jip = value; } }, metadata: _metadata }, _jip_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a.GAME_STORAGE = property('noxcrew.kp:current_game'),
        _a;
})();
export { GameManager };
