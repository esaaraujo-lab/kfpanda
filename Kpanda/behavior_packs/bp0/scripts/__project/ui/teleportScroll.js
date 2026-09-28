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
import { EasingType, system, world } from "@minecraft/server";
import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import { Inject, Module, property, SequenceManager, TitleManagerV2 } from "noxcrew.common.scripting/index.js";
import { timeout } from "../util/timer.js";
import { GameManager } from "../game/GameManager.js";
import { JoinInProgress } from "../joinInProgress.js";
import { seqIntroductionTutorial } from "../sequences.js";
import { stringToVector3 } from "../util/stringToVector3.js";
import { tryOpenScriptWindow } from "./lockedScriptWindow.js";
const LOCATIONS = {
    palace: {
        texture: 'textures/ui/noxcrew/teleport/palace.png',
        location: stringToVector3('129 84 62'),
        jipLocation: 'jade_palace',
        rotation: { x: 0, y: 90 },
        map: 'JADE_PALACE',
    },
    peace: {
        texture: 'textures/ui/noxcrew/teleport/peace.png',
        location: stringToVector3('452 -46 62'),
        jipLocation: 'peace_valley',
        rotation: { x: 0, y: 0 },
        map: 'PEACE_VALLEY',
    },
    gongmen: {
        texture: 'textures/ui/noxcrew/teleport/gongmen.png',
        location: stringToVector3('2082 -31 228'),
        jipLocation: 'gongmen_city',
        rotation: { x: 0, y: 270 },
        map: 'GONGMEN_CITY',
    },
    village: {
        texture: 'textures/ui/noxcrew/teleport/village.png',
        location: stringToVector3('4034 122 153'),
        jipLocation: 'panda_village',
        rotation: { x: 0, y: 310 },
        map: 'PANDA_VILLAGE',
    },
    harbor: {
        texture: 'textures/ui/noxcrew/teleport/harbor.png',
        location: stringToVector3('6241 2 94'),
        jipLocation: 'juniper_harbor',
        rotation: { x: 0, y: 60 },
        map: 'JUNIPER_CITY',
    },
    castle: {
        texture: 'textures/ui/noxcrew/teleport/castle.png',
        location: stringToVector3('6173 99 256'),
        jipLocation: 'juniper_castle',
        rotation: { x: -20, y: 270 },
        titleOverride: 'harbor',
        map: 'JUNIPER_CITY',
    },
    academy: {
        texture: 'textures/ui/noxcrew/teleport/palace.png',
        location: {
            x: 0,
            y: 0,
            z: 0,
        },
        rotation: { x: 0, y: 0 },
        jipLocation: 'lee_da_academy',
        hidden: true,
        map: 'NONE',
    },
    spawn_room: {
        texture: 'textures/ui/noxcrew/teleport/palace.png',
        location: {
            x: 0,
            y: 0,
            z: 0,
        },
        rotation: { x: 0, y: 0 },
        jipLocation: 'spawn_room',
        hidden: true,
        map: 'NONE',
    },
};
let TeleportScrollModule = (() => {
    var _a, _TeleportScrollModule_sequenceManager_accessor_storage, _TeleportScrollModule_titleManager_accessor_storage, _TeleportScrollModule_gameManager_accessor_storage, _TeleportScrollModule_jip_accessor_storage;
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
    return _a = class TeleportScrollModule extends _classSuper {
            constructor() {
                super(...arguments);
                _TeleportScrollModule_sequenceManager_accessor_storage.set(this, (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _sequenceManager_initializers, void 0)));
                _TeleportScrollModule_titleManager_accessor_storage.set(this, __runInitializers(this, _titleManager_initializers, void 0));
                _TeleportScrollModule_gameManager_accessor_storage.set(this, __runInitializers(this, _gameManager_initializers, void 0));
                _TeleportScrollModule_jip_accessor_storage.set(this, __runInitializers(this, _jip_initializers, void 0));
            }
            get sequenceManager() { return __classPrivateFieldGet(this, _TeleportScrollModule_sequenceManager_accessor_storage, "f"); }
            set sequenceManager(value) { __classPrivateFieldSet(this, _TeleportScrollModule_sequenceManager_accessor_storage, value, "f"); }
            get titleManager() { return __classPrivateFieldGet(this, _TeleportScrollModule_titleManager_accessor_storage, "f"); }
            set titleManager(value) { __classPrivateFieldSet(this, _TeleportScrollModule_titleManager_accessor_storage, value, "f"); }
            get gameManager() { return __classPrivateFieldGet(this, _TeleportScrollModule_gameManager_accessor_storage, "f"); }
            set gameManager(value) { __classPrivateFieldSet(this, _TeleportScrollModule_gameManager_accessor_storage, value, "f"); }
            get jip() { return __classPrivateFieldGet(this, _TeleportScrollModule_jip_accessor_storage, "f"); }
            set jip(value) { __classPrivateFieldSet(this, _TeleportScrollModule_jip_accessor_storage, value, "f"); }
            async sendPlayersTo(from, to) {
                const location = LOCATIONS[to];
                world.setDynamicProperty(_a.SCROLL_TRAVELING, true);
                if (!!this.jipClaim) {
                    this.unregisterChild(this.jipClaim);
                }
                this.jipClaim = this.jip.setLocation(this, location.jipLocation, 10);
                world.getDimension('overworld').runCommandAsync('function music/music_travel');
                for (const player of world.getAllPlayers()) {
                    player.onScreenDisplay.setTitle(`nox:map_${from}_${to}`);
                }
                await timeout(_a.CUTSCENE_TIMES.mapIn);
                this.jip.teleportAll(true);
                for (const player of world.getAllPlayers()) {
                    player.setRotation(location.rotation);
                    player.runCommandAsync('inputpermission set @s movement disabled');
                    player.runCommandAsync('inputpermission set @s camera disabled');
                    player.camera.setCamera(`noxcrew_kp:cutscene_area_${to}_start`);
                }
                world.setDynamicProperty(_a.LAST_LOCATION_PROPERTY, to);
                await timeout(_a.CUTSCENE_TIMES.mapShow);
                world.getDimension('overworld').runCommandAsync(`function music/${location.jipLocation}`);
                if (from === 'academy') {
                    await this.sequenceManager.runAndWait(seqIntroductionTutorial, this.titleManager);
                }
                else {
                    await timeout(_a.CUTSCENE_TIMES.mapFadeOut);
                    for (const player of world.getAllPlayers()) {
                        player.onScreenDisplay.setTitle(`nox:area_in_${to}`);
                        player.camera.setCamera(`noxcrew_kp:cutscene_area_${to}_end`, {
                            easeOptions: { easeTime: _a.CUTSCENE_TIMES.cutscene / 20, easeType: EasingType.InOutSine },
                        });
                    }
                    await timeout(_a.CUTSCENE_TIMES.cutscene);
                    for (const player of world.getAllPlayers()) {
                        player.camera.fade({
                            fadeColor: { blue: 0.09, red: 0.109, green: 0.09 },
                            fadeTime: {
                                fadeInTime: _a.CUTSCENE_TIMES.fade / 20,
                                fadeOutTime: _a.CUTSCENE_TIMES.fade / 20,
                                holdTime: 1,
                            },
                        });
                    }
                    await timeout(_a.CUTSCENE_TIMES.fade);
                }
                world.setDynamicProperty(_a.SCROLL_TRAVELING, false);
                for (const player of world.getAllPlayers()) {
                    player.runCommandAsync('gamemode adventure');
                    player.runCommandAsync('inputpermission set @s movement enabled');
                    player.runCommandAsync('inputpermission set @s camera enabled');
                    player.camera.clear();
                }
            }
            async openTeleportScroll(sender, from) {
                let target;
                if (this.gameManager.currentRunningGame != null) {
                    throw new Error("Can't open teleport scroll while a game is running");
                }
                const teleportScroll = new ActionFormData();
                teleportScroll.title({ translate: 'txt.title.teleport_scroll' });
                teleportScroll.body({
                    rawtext: [{ translate: 'txt.ui.tp.choice1' }, { text: '\n \n' }, { translate: 'txt.ui.tp.choice2' }],
                });
                let entries;
                if (from == 'academy') {
                    entries = [['palace', LOCATIONS.palace]];
                }
                else
                    entries = Object.entries(LOCATIONS).filter(([name, button]) => name !== from && !('hidden' in button));
                for (const [name, button] of entries) {
                    teleportScroll.button({ translate: `txt.title.dia.area_${name}` }, button.texture);
                }
                const locationFormResult = await tryOpenScriptWindow(teleportScroll, sender);
                if (locationFormResult == undefined ||
                    locationFormResult.canceled ||
                    locationFormResult.selection == null ||
                    world.getDynamicProperty(_a.SCROLL_TRAVELING) == true)
                    return;
                target = entries[locationFormResult.selection][0];
                const bodyMessage = {
                    rawtext: [
                        { translate: 'txt.ui.tp.confirm1' },
                        { text: '\n \n' },
                        {
                            translate: 'txt.ui.tp.confirm2',
                            with: {
                                rawtext: [{ translate: `txt.title.dia.area_${target}` }],
                            },
                        },
                    ],
                };
                const confirmDialog = new MessageFormData()
                    .title({ translate: 'txt.title.teleport_scroll' })
                    .body(bodyMessage)
                    .button1({ translate: 'txt.button.no' })
                    .button2({ translate: 'txt.button.yes' });
                if ((await tryOpenScriptWindow(confirmDialog, sender))?.selection !== 1)
                    return;
                if (world.getDynamicProperty(_a.SCROLL_TRAVELING) == true)
                    return;
                await this.sendPlayersTo(from, target);
            }
            async openEndGameScroll(player) {
                const returnLoc = world.getDynamicProperty(_a.LAST_LOCATION_PROPERTY);
                const bodyMessage = {
                    rawtext: [
                        { translate: 'txt.ui.tp.leave1' },
                        { text: '\n \n' },
                        { translate: 'txt.ui.tp.leave2', with: { rawtext: [{ translate: `txt.title.dia.area_${returnLoc}` }] } },
                    ],
                };
                const endGameDialog = new MessageFormData()
                    .title({ translate: 'txt.title.teleport_scroll' })
                    .body(bodyMessage)
                    .button1({ translate: 'txt.button.back' })
                    .button2({ translate: 'txt.button.yes' });
                if ((await tryOpenScriptWindow(endGameDialog, player))?.selection !== 1)
                    return;
                this.gameManager.endGame();
            }
            setup() {
                const mapStart = world.getDynamicProperty(_a.MAP_STARTED);
                const lastLocationName = world.getDynamicProperty(_a.LAST_LOCATION_PROPERTY);
                world.setDynamicProperty(_a.SCROLL_TRAVELING, false);
                if (mapStart === 'started')
                    this.jipClaim = this.jip.setLocation(this, LOCATIONS[lastLocationName ?? 'palace'].jipLocation, 10);
                if (lastLocationName) {
                    world.getDimension('overworld').runCommandAsync(`function music/${LOCATIONS[lastLocationName].jipLocation}`);
                }
                this.listenFor(world.afterEvents.itemUse, e => {
                    const scrollTraveling = world.getDynamicProperty(_a.SCROLL_TRAVELING);
                    if (e.itemStack.typeId != _a.TELEPORT_SCROLL_ITEM || scrollTraveling)
                        return;
                    if (this.gameManager.currentRunningGame != null) {
                        this.openEndGameScroll(e.source);
                    }
                    else {
                        this.openTeleportScroll(e.source, world.getDynamicProperty(_a.LAST_LOCATION_PROPERTY) ?? 'palace');
                    }
                });
                this.listenFor(this.gameManager.events, e => {
                    if (e.type !== 'ended')
                        return;
                    world
                        .getDimension('overworld')
                        .runCommandAsync(`function music/${LOCATIONS[world.getDynamicProperty(_a.LAST_LOCATION_PROPERTY)].jipLocation}`);
                });
                this.listenFor(system.afterEvents.scriptEventReceive, e => {
                    if (e.id != _a.TELEPORT_SCROLL ||
                        !e.sourceEntity ||
                        e.sourceEntity.typeId != _a.TELEPORT_SCROLL)
                        return;
                    const players = e.sourceEntity.dimension.getPlayers({
                        location: e.sourceEntity.location,
                        maxDistance: 16,
                        tags: [_a.INTERACT_TAG],
                    });
                    for (const player of players) {
                        player.removeTag(_a.INTERACT_TAG);
                        this.openTeleportScroll(player, e.sourceEntity.getProperty(_a.SOURCE_LOCATION_PROPERTY) ?? 'academy');
                    }
                });
            }
            offsetSpawn(pos, rad) {
                return {
                    x: Math.floor(pos.x) - rad + Math.floor(Math.random() * (rad * 2 + 1)) + 0.5,
                    y: pos.y,
                    z: Math.floor(pos.z) - rad + Math.floor(Math.random() * (rad * 2 + 1)) + 0.5,
                };
            }
        },
        _TeleportScrollModule_sequenceManager_accessor_storage = new WeakMap(),
        _TeleportScrollModule_titleManager_accessor_storage = new WeakMap(),
        _TeleportScrollModule_gameManager_accessor_storage = new WeakMap(),
        _TeleportScrollModule_jip_accessor_storage = new WeakMap(),
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
        _a.CUTSCENE_TIMES = {
            mapIn: 20,
            mapShow: 200,
            mapFadeOut: 20,
            cutscene: 100,
            fade: 10,
        },
        _a.TELEPORT_SCROLL = 'noxcrew.kp:teleport_scroll',
        _a.TELEPORT_SCROLL_ITEM = 'noxcrew.kp:teleport_scroll_att',
        _a.SOURCE_LOCATION_PROPERTY = property('noxcrew.kp:source_location'),
        _a.LAST_LOCATION_PROPERTY = property('noxcrew.kp:last_location'),
        _a.SCROLL_TRAVELING = property('noxcrew.kp:is_traveling'),
        _a.MAP_STARTED = property('noxcrew.kp:start_map'),
        _a.INTERACT_TAG = 'teleport_scroll_interact',
        _a;
})();
export { TeleportScrollModule };
