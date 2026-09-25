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
import { Player, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { GAME_LOCATIONS, GameManager } from "../game/GameManager.js";
import { delay, Inject, Module, property, ScopedTimer, SequenceManager, TitleManagerV2, } from "noxcrew.common.scripting/index.js";
import { seqTutorialCookingDumplings, seqTutorialCookingNoodles, seqTutorialDragonDance, seqTutorialKomodo, seqTutorialParkour, seqTutorialTraining, seqTutorialWolfGongmen, seqTutorialWolfPeace, } from "../tutorials.js";
import { stringToVector3 } from "../util/stringToVector3.js";
import { timeout } from "../util/timer.js";
import { tryOpenScriptWindow } from "./lockedScriptWindow.js";
import { JIP_LOCATION_MAPS, JoinInProgress } from "../joinInProgress.js";
import { MapManager } from "../map/mapManager.js";
const ACTIVITIES = {
    PARKOUR: {
        jipLoc: 'tut_dumpling_parkour',
        cutsceneTimes: [400, 400, 400],
        activity: 'PARKOUR',
        skip: false,
        promptBodyLineCount: 3,
        stasisBodyLineCount: 3,
        tutorialSequence: seqTutorialParkour,
    },
    COOKING_DUMPLINGS: {
        jipLoc: 'tut_dumpling_cooking',
        cutsceneTimes: [400, 400, 400],
        activity: 'COOKING_DUMPLINGS',
        skip: false,
        promptBodyLineCount: 2,
        stasisBodyLineCount: 3,
        tutorialSequence: seqTutorialCookingDumplings,
    },
    COOKING_NOODLES: {
        jipLoc: 'tut_noodle_cooking',
        cutsceneTimes: [400, 400, 400],
        activity: 'COOKING_NOODLES',
        skip: false,
        promptBodyLineCount: 2,
        stasisBodyLineCount: 3,
        tutorialSequence: seqTutorialCookingNoodles,
    },
    DRAGON_DANCE: {
        jipLoc: 'tut_munching',
        cutsceneTimes: [400, 400, 400],
        activity: 'DRAGON_DANCE',
        skip: false,
        promptBodyLineCount: 3,
        stasisBodyLineCount: 3,
        tutorialSequence: seqTutorialDragonDance,
    },
    TRAINING: {
        jipLoc: 'tut_training',
        cutsceneTimes: [400, 400, 400],
        activity: 'TRAINING',
        skip: false,
        promptBodyLineCount: 2,
        stasisBodyLineCount: 3,
        tutorialSequence: seqTutorialTraining,
    },
    WOLF_GONGMEN: {
        jipLoc: 'tut_wolf_city',
        cutsceneTimes: [400, 400, 400],
        activity: 'WOLF_GONGMEN',
        skip: false,
        promptBodyLineCount: 3,
        stasisBodyLineCount: 3,
        tutorialSequence: seqTutorialWolfGongmen,
    },
    WOLF_PEACE: {
        jipLoc: 'tut_wolf_peace',
        cutsceneTimes: [400, 400, 400],
        activity: 'WOLF_PEACE',
        skip: false,
        promptBodyLineCount: 3,
        stasisBodyLineCount: 3,
        tutorialSequence: seqTutorialWolfPeace,
    },
    KOMODO: {
        jipLoc: 'tut_komodo_fight',
        cutsceneTimes: [400, 400, 400],
        activity: 'KOMODO',
        skip: false,
        promptBodyLineCount: 3,
        stasisBodyLineCount: 3,
        tutorialSequence: seqTutorialKomodo,
    },
    BOSS_TAI: {
        jipLoc: 'none',
        cutsceneTimes: [400, 400, 400],
        activity: 'BOSS_TAI',
        skip: true,
        promptBodyLineCount: 2,
        stasisBodyLineCount: 3,
        tutorialSequence: undefined,
    },
    BOSS_SHEN: {
        jipLoc: 'none',
        cutsceneTimes: [400, 400, 400],
        activity: 'BOSS_SHEN',
        skip: true,
        promptBodyLineCount: 2,
        stasisBodyLineCount: 3,
        tutorialSequence: undefined,
    },
    BOSS_KAI: {
        jipLoc: 'none',
        cutsceneTimes: [400, 400, 400],
        activity: 'BOSS_KAI',
        skip: true,
        promptBodyLineCount: 2,
        stasisBodyLineCount: 3,
        tutorialSequence: undefined,
    },
    BOSS_CHAMELEON: {
        jipLoc: 'none',
        cutsceneTimes: [400, 400, 400],
        activity: 'BOSS_CHAMELEON',
        skip: true,
        promptBodyLineCount: 2,
        stasisBodyLineCount: 3,
        tutorialSequence: undefined,
    },
};
function* seqStatisCutscene(activityName, timings) {
    while (true) {
        for (let i = 0; i < timings.length; i++) {
            const sceneName = `noxcrew_kp:${activityName.toLowerCase()}_stasis_${i + 1}`;
            for (const player of world.getAllPlayers()) {
                player.camera.setCamera(`${sceneName}_start`);
                player.camera.setCamera(`${sceneName}_end`, { easeOptions: { easeTime: timings[i] / 20 } });
            }
            yield* delay(timings[i] - 10);
            for (const player of world.getAllPlayers()) {
                player.camera.fade({
                    fadeColor: { blue: 0.09, red: 0.109, green: 0.09 },
                    fadeTime: {
                        fadeInTime: 10 / 20,
                        fadeOutTime: 10 / 20,
                        holdTime: 1,
                    },
                });
            }
            yield* delay(10);
        }
    }
}
function createBodyText(key, count) {
    const out = [];
    for (let i = 1; i <= count; i++) {
        out.push({ translate: key + i });
        if (i != count) {
            out.push({ text: '\n \n' });
        }
    }
    return { rawtext: out };
}
let PreGameMenu = (() => {
    var _a, _PreGameMenu_sequenceManager_accessor_storage, _PreGameMenu_titleManager_accessor_storage, _PreGameMenu_gameManager_accessor_storage, _PreGameMenu_jip_accessor_storage;
    let _classSuper = Module;
    let _instanceExtraInitializers = [];
    let _sequenceManager_decorators;
    let _sequenceManager_initializers = [];
    let _titleManager_decorators;
    let _titleManager_initializers = [];
    let _gameManager_decorators;
    let _gameManager_initializers = [];
    let _jip_decorators;
    let _jip_initializers = [];
    return _a = class PreGameMenu extends _classSuper {
            get sequenceManager() { return __classPrivateFieldGet(this, _PreGameMenu_sequenceManager_accessor_storage, "f"); }
            set sequenceManager(value) { __classPrivateFieldSet(this, _PreGameMenu_sequenceManager_accessor_storage, value, "f"); }
            get titleManager() { return __classPrivateFieldGet(this, _PreGameMenu_titleManager_accessor_storage, "f"); }
            set titleManager(value) { __classPrivateFieldSet(this, _PreGameMenu_titleManager_accessor_storage, value, "f"); }
            get gameManager() { return __classPrivateFieldGet(this, _PreGameMenu_gameManager_accessor_storage, "f"); }
            set gameManager(value) { __classPrivateFieldSet(this, _PreGameMenu_gameManager_accessor_storage, value, "f"); }
            get jip() { return __classPrivateFieldGet(this, _PreGameMenu_jip_accessor_storage, "f"); }
            set jip(value) { __classPrivateFieldSet(this, _PreGameMenu_jip_accessor_storage, value, "f"); }
            constructor(manager, driver, activity) {
                super(manager.container);
                this.manager = (__runInitializers(this, _instanceExtraInitializers), manager);
                this.activity = activity;
                _PreGameMenu_sequenceManager_accessor_storage.set(this, __runInitializers(this, _sequenceManager_initializers, void 0));
                _PreGameMenu_titleManager_accessor_storage.set(this, __runInitializers(this, _titleManager_initializers, void 0));
                _PreGameMenu_gameManager_accessor_storage.set(this, __runInitializers(this, _gameManager_initializers, void 0));
                _PreGameMenu_jip_accessor_storage.set(this, __runInitializers(this, _jip_initializers, void 0));
                this.menu = new ActionFormData()
                    .title({ translate: `txt.ui.stasis.${this.activity.toLowerCase()}.title` })
                    .body(createBodyText(`txt.ui.stasis.${this.activity.toLowerCase()}.body`, ACTIVITIES[this.activity].stasisBodyLineCount))
                    .button({ translate: 'txt.ui.stasis.btn.start' })
                    .button({ translate: 'txt.ui.stasis.btn.tutorial' })
                    .button({ translate: 'txt.button.exit' });
                this.driverId = driver.id;
            }
            fade(ticks) {
                for (const player of world.getAllPlayers()) {
                    player.camera.fade({
                        fadeColor: { blue: 0.09, red: 0.109, green: 0.09 },
                        fadeTime: {
                            fadeInTime: ticks / 20,
                            fadeOutTime: ticks / 20,
                            holdTime: 1,
                        },
                    });
                }
            }
            async drive(player) {
                for (const player of world.getAllPlayers()) {
                    player.onScreenDisplay.setTitle(`nox:letterbox_stasis`);
                    player.addEffect('invisibility', 20000000, { amplifier: 1, showParticles: false });
                }
                await timeout(60);
                const result = await this.menu.show(player);
                this.fade(_a.FADE_TIME);
                for (const player of world.getAllPlayers()) {
                    player.onScreenDisplay.setTitle(`nox:letterbox_out`);
                }
                ScopedTimer.schedule(this, _a.FADE_TIME, () => {
                    for (const player of world.getAllPlayers()) {
                        player.runCommandAsync('gamemode adventure');
                        player.runCommand('inputpermission set @s movement enabled');
                        player.runCommand('inputpermission set @s camera enabled');
                        player.removeEffect('invisibility');
                    }
                    switch (result.selection) {
                        case 0:
                            world.getDimension('overworld').runCommandAsync('function music/stop');
                            this.gameManager.startGame(this.activity, this.driverId);
                            this.manager.close(true);
                            break;
                        case 1:
                            this.playTutorial();
                            break;
                        case 2:
                        case undefined:
                            this.fade(_a.FADE_TIME);
                            const returnLoc = stringToVector3(GAME_LOCATIONS[this.activity].returnLocation);
                            ScopedTimer.schedule(this, _a.FADE_TIME, () => {
                                for (const player of world.getAllPlayers()) {
                                    player.camera.clear();
                                    player.teleport(returnLoc);
                                    player.setSpawnPoint({
                                        dimension: world.getDimension('overworld'),
                                        ...returnLoc,
                                    });
                                }
                                this.manager.close();
                            });
                            break;
                    }
                });
            }
            setup() {
                this.listenFor(world.afterEvents.playerLeave, e => {
                    if (e.playerId == this.driverId) {
                        this.manager.close();
                    }
                });
            }
            onActivate() {
                this.fade(_a.FADE_TIME);
                this.jip.setLocation(this, ACTIVITIES[this.activity].jipLoc, 15);
                ScopedTimer.schedule(this, 10, () => {
                    this.jip.teleportAll();
                });
                ScopedTimer.schedule(this, _a.FADE_TIME + 5, () => {
                    this.cutsceneSequenceId = this.sequenceManager.run(seqStatisCutscene, this.activity, ACTIVITIES[this.activity].cutsceneTimes);
                    for (const player of world.getAllPlayers()) {
                        if (player.id == this.driverId) {
                            this.drive(player);
                        }
                    }
                    this.cutsceneHandle = this.titleManager.addTitle({
                        type: 'persist',
                        weight: 100,
                        components: {
                            actionbar: { rawtext: [{ translate: 'txt.gs.msg4' }] },
                        },
                    });
                });
            }
            onDeactivate() {
                if (this.cutsceneSequenceId != null) {
                    this.sequenceManager.cancel(this.cutsceneSequenceId);
                    for (const player of world.getAllPlayers()) {
                        player.camera.clear();
                    }
                }
                if (this.cutsceneHandle != undefined) {
                    this.titleManager.removeTitle(this.cutsceneHandle);
                }
            }
            async playTutorial() {
                this.fade(_a.FADE_TIME);
                await timeout(_a.FADE_TIME);
                this.onDeactivate();
                if (ACTIVITIES[this.activity].tutorialSequence != undefined) {
                    await this.sequenceManager.runAndWait(ACTIVITIES[this.activity].tutorialSequence, this.titleManager);
                }
                this.fade(_a.FADE_TIME);
                await timeout(_a.FADE_TIME);
                this.onActivate();
            }
        },
        _PreGameMenu_sequenceManager_accessor_storage = new WeakMap(),
        _PreGameMenu_titleManager_accessor_storage = new WeakMap(),
        _PreGameMenu_gameManager_accessor_storage = new WeakMap(),
        _PreGameMenu_jip_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _sequenceManager_decorators = [Inject(SequenceManager)];
            _titleManager_decorators = [Inject(TitleManagerV2)];
            _gameManager_decorators = [Inject(GameManager)];
            _jip_decorators = [Inject(JoinInProgress)];
            __esDecorate(_a, null, _sequenceManager_decorators, { kind: "accessor", name: "sequenceManager", static: false, private: false, access: { has: obj => "sequenceManager" in obj, get: obj => obj.sequenceManager, set: (obj, value) => { obj.sequenceManager = value; } }, metadata: _metadata }, _sequenceManager_initializers, _instanceExtraInitializers);
            __esDecorate(_a, null, _titleManager_decorators, { kind: "accessor", name: "titleManager", static: false, private: false, access: { has: obj => "titleManager" in obj, get: obj => obj.titleManager, set: (obj, value) => { obj.titleManager = value; } }, metadata: _metadata }, _titleManager_initializers, _instanceExtraInitializers);
            __esDecorate(_a, null, _gameManager_decorators, { kind: "accessor", name: "gameManager", static: false, private: false, access: { has: obj => "gameManager" in obj, get: obj => obj.gameManager, set: (obj, value) => { obj.gameManager = value; } }, metadata: _metadata }, _gameManager_initializers, _instanceExtraInitializers);
            __esDecorate(_a, null, _jip_decorators, { kind: "accessor", name: "jip", static: false, private: false, access: { has: obj => "jip" in obj, get: obj => obj.jip, set: (obj, value) => { obj.jip = value; } }, metadata: _metadata }, _jip_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a.FADE_TIME = 10,
        _a;
})();
export { PreGameMenu };
let GameStartScrollManager = (() => {
    var _a, _GameStartScrollManager_gameManager_accessor_storage, _GameStartScrollManager_jip_accessor_storage;
    let _classSuper = Module;
    let _instanceExtraInitializers = [];
    let _gameManager_decorators;
    let _gameManager_initializers = [];
    let _jip_decorators;
    let _jip_initializers = [];
    return _a = class GameStartScrollManager extends _classSuper {
            constructor() {
                super(...arguments);
                this.JIP_PROPERTY = (__runInitializers(this, _instanceExtraInitializers), property('noxcrew.common.scripting:jip'));
                _GameStartScrollManager_gameManager_accessor_storage.set(this, __runInitializers(this, _gameManager_initializers, void 0));
                _GameStartScrollManager_jip_accessor_storage.set(this, __runInitializers(this, _jip_initializers, void 0));
                this.preGameMenu = undefined;
                this.isOpen = false;
            }
            get gameManager() { return __classPrivateFieldGet(this, _GameStartScrollManager_gameManager_accessor_storage, "f"); }
            set gameManager(value) { __classPrivateFieldSet(this, _GameStartScrollManager_gameManager_accessor_storage, value, "f"); }
            get jip() { return __classPrivateFieldGet(this, _GameStartScrollManager_jip_accessor_storage, "f"); }
            set jip(value) { __classPrivateFieldSet(this, _GameStartScrollManager_jip_accessor_storage, value, "f"); }
            close(gameStarted = false) {
                if (this.preGameMenu == undefined)
                    return;
                world.playMusic('music_lobby_outro');
                this.unregisterChild(this.preGameMenu);
                this.preGameMenu = undefined;
                if (gameStarted)
                    return;
                const location = this.jip.getCurrentLocation();
                for (const player of world.getAllPlayers()) {
                    player.setDynamicProperty(this.JIP_PROPERTY, location);
                    MapManager.updateMap(player, JIP_LOCATION_MAPS[location]);
                }
            }
            open(driver, game) {
                if (!!this.preGameMenu || this.gameManager.currentRunningGame != null || driver == null)
                    return;
                world.playMusic('music_lobby_intro');
                world.queueMusic('music_lobby_loop', { loop: true });
                this.preGameMenu = new PreGameMenu(this, driver, game);
                this.registerChild(this.preGameMenu);
            }
            setup() {
                this.listenFor(system.afterEvents.scriptEventReceive, async (e) => {
                    if (e.id != _a.ENTITY || !e.sourceEntity || this.isOpen)
                        return;
                    const player = e.sourceEntity.dimension.getPlayers({
                        location: e.sourceEntity.location,
                        maxDistance: 16,
                        tags: [_a.INTERACT_TAG],
                    })[0];
                    if (player == null)
                        return;
                    this.isOpen = true;
                    try {
                        player.removeTag(_a.INTERACT_TAG);
                        const game = e.sourceEntity
                            .getProperty(_a.ACTIVITY_TO_START_PROPERTY)
                            .toUpperCase();
                        const activity = ACTIVITIES[game];
                        const form = new ActionFormData()
                            .title({ translate: `txt.title.dia.activity_${game.toLowerCase()}` })
                            .body(createBodyText(`txt.activity_${game.toLowerCase()}_start.dia`, activity.promptBodyLineCount))
                            .button({ translate: 'txt.button.start' })
                            .button({ translate: 'txt.button.back' });
                        const response = await tryOpenScriptWindow(form, player);
                        switch (response?.selection) {
                            case 0: {
                                if (activity.skip) {
                                    this.gameManager.startGame(game);
                                    return;
                                }
                                this.open(player, game);
                                break;
                            }
                            case undefined:
                            case 1:
                                return;
                        }
                    }
                    finally {
                        this.isOpen = false;
                    }
                });
                this.listenFor(system.afterEvents.scriptEventReceive, e => {
                    if (e.id != _a.OPEN_MENU_EVENT || !e.sourceEntity || !(e.sourceEntity instanceof Player))
                        return;
                    const player = e.sourceEntity;
                    const game = e.message.toUpperCase();
                    if (ACTIVITIES[game].skip) {
                        this.gameManager.startGame(game);
                        return;
                    }
                    this.open(player, game);
                });
            }
        },
        _GameStartScrollManager_gameManager_accessor_storage = new WeakMap(),
        _GameStartScrollManager_jip_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _gameManager_decorators = [Inject(GameManager)];
            _jip_decorators = [Inject(JoinInProgress)];
            __esDecorate(_a, null, _gameManager_decorators, { kind: "accessor", name: "gameManager", static: false, private: false, access: { has: obj => "gameManager" in obj, get: obj => obj.gameManager, set: (obj, value) => { obj.gameManager = value; } }, metadata: _metadata }, _gameManager_initializers, _instanceExtraInitializers);
            __esDecorate(_a, null, _jip_decorators, { kind: "accessor", name: "jip", static: false, private: false, access: { has: obj => "jip" in obj, get: obj => obj.jip, set: (obj, value) => { obj.jip = value; } }, metadata: _metadata }, _jip_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a.ENTITY = 'noxcrew.kp:game_scroll',
        _a.ACTIVITY_TO_START_PROPERTY = property('noxcrew.kp:target_game'),
        _a.INTERACT_TAG = 'game_scroll_interact',
        _a.OPEN_MENU_EVENT = 'noxcrew.kp:open_game_menu',
        _a;
})();
export { GameStartScrollManager };
