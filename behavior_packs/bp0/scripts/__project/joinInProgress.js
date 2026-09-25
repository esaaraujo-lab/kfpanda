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
import { Inject, Module, ScopedTimer, property, throwErr } from "noxcrew.common.scripting/index.js";
import { Claim, ClaimableManager } from "./util/claimable.js";
import { stringToVector3 } from "./util/stringToVector3.js";
import { isInBounds } from "./util/vectorMath.js";
import { MapManager } from "./map/mapManager.js";
import { offsetSpawn } from "./util/offsetSpawn.js";
let JoinInProgress = (() => {
    var _a, _JoinInProgress_claimableManager_accessor_storage;
    let _classSuper = Module;
    let _instanceExtraInitializers = [];
    let _claimableManager_decorators;
    let _claimableManager_initializers = [];
    return _a = class JoinInProgress extends _classSuper {
            constructor(container, locations, hasBeenSillyAndBrokenTheMap) {
                super(container);
                this.locations = (__runInitializers(this, _instanceExtraInitializers), locations);
                this.hasBeenSillyAndBrokenTheMap = hasBeenSillyAndBrokenTheMap;
                this.property = property('noxcrew.common.scripting:jip');
                _JoinInProgress_claimableManager_accessor_storage.set(this, __runInitializers(this, _claimableManager_initializers, void 0));
            }
            get claimableManager() { return __classPrivateFieldGet(this, _JoinInProgress_claimableManager_accessor_storage, "f"); }
            set claimableManager(value) { __classPrivateFieldSet(this, _JoinInProgress_claimableManager_accessor_storage, value, "f"); }
            setup() {
                this.listenFor(world.afterEvents.playerSpawn, e => {
                    const player = e.player;
                    const game = world.getDynamicProperty(_a.GAME_STORAGE);
                    if (!e.initialSpawn) {
                        this.forceTeleport(player);
                    }
                    else if ((player.getEffect('invisibility') || player.isFlying) && (game == undefined || game === 'NONE')) {
                        this.forceTeleport(player);
                    }
                    else
                        this.teleport(player);
                });
            }
            getCurrentLocation() {
                return this.claimableManager.getValue(this.property);
            }
            teleport(player) {
                const location = this.getCurrentLocation() ?? throwErr('No JIP location to teleport to!');
                const currentLocation = player.getDynamicProperty(this.property);
                if (!this.hasBeenSillyAndBrokenTheMap(player) && (location == currentLocation || !currentLocation))
                    return;
                if (location.startsWith('tut_')) {
                    player.teleport(this.locations[location]);
                }
                else {
                    player.teleport(offsetSpawn(this.locations[location], 2));
                }
                player.setDynamicProperty(this.property, location);
                player.runCommandAsync('gamemode adventure');
                player.removeEffect('invisibility');
                MapManager.updateMap(player, JIP_LOCATION_MAPS[location]);
            }
            forceTeleport(player) {
                const location = this.getCurrentLocation() ?? throwErr('No JIP location to teleport to!');
                player.teleport(offsetSpawn(this.locations[location], 2));
                player.setDynamicProperty(this.property, location);
                player.runCommandAsync('gamemode adventure');
                player.removeEffect('invisibility');
                MapManager.updateMap(player, JIP_LOCATION_MAPS[location]);
            }
            teleportAll(force = false) {
                for (const player of world.getAllPlayers()) {
                    if (force) {
                        this.forceTeleport(player);
                    }
                    else {
                        this.teleport(player);
                    }
                }
            }
            setLocation(module, location, weight = 0, teleportNow = false) {
                const claim = new Claim(module.container, this.property, weight, () => location);
                module.registerChild(claim);
                ScopedTimer.schedule(this, 1, () => {
                    if (teleportNow) {
                        this.teleportAll();
                    }
                    for (const player of world.getAllPlayers()) {
                        player.setSpawnPoint({
                            dimension: world.getDimension('overworld'),
                            ...this.locations[location],
                        });
                    }
                });
                return claim;
            }
        },
        _JoinInProgress_claimableManager_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _claimableManager_decorators = [Inject(ClaimableManager)];
            __esDecorate(_a, null, _claimableManager_decorators, { kind: "accessor", name: "claimableManager", static: false, private: false, access: { has: obj => "claimableManager" in obj, get: obj => obj.claimableManager, set: (obj, value) => { obj.claimableManager = value; } }, metadata: _metadata }, _claimableManager_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a.GAME_STORAGE = property('noxcrew.kp:current_game'),
        _a;
})();
export { JoinInProgress };
export const JIP_LOCATIONS = {
    spawn_room: stringToVector3('-3996 228 76'),
    lee_da_academy: stringToVector3('-1921 226 65'),
    jade_palace: stringToVector3('129 84 62'),
    peace_valley: stringToVector3('452 -46 62'),
    gongmen_city: stringToVector3('2082 -31 228'),
    panda_village: stringToVector3('4034 122 153'),
    juniper_harbor: stringToVector3('6241 2 94'),
    juniper_castle: stringToVector3('6173 99 256'),
    tai_lung_1: stringToVector3('211 56 8046'),
    tai_lung_2: stringToVector3('398 -36 10110'),
    lord_shen_1: stringToVector3('2177 -45 6130'),
    lord_shen_2: stringToVector3('1953 -49 8119'),
    general_kai_1: stringToVector3('4123 133 6123'),
    general_kai_2: stringToVector3('4072 48 8013'),
    chameleon_1: stringToVector3('6198 25 4036'),
    chameleon_2: stringToVector3('6198 25 4036'),
    chameleon_3: stringToVector3('6201 70 5026'),
    tut_training: stringToVector3('519 19 6018'),
    tut_munching: stringToVector3('2083 -33 2213'),
    tut_wolf_peace: stringToVector3('531 -38 4581'),
    tut_wolf_city: stringToVector3('2137 -15 4180'),
    tut_dumpling_parkour: stringToVector3('4029 120 2151'),
    tut_dumpling_cooking: stringToVector3('4079 123 4104'),
    tut_noodle_cooking: stringToVector3('525 -42 2031'),
    tut_komodo_fight: stringToVector3('6245 25 2024'),
    training_hall: stringToVector3('520 1 6011'),
    dragon_suit_munching: stringToVector3('2081 -33 2228'),
    wolf_thieves_peace: stringToVector3('537 -52 4596'),
    wolf_thieves_city: stringToVector3('2137 -38 4180'),
    dumpling_parkour: stringToVector3('4031 120 2151'),
    dumpling_cooking: stringToVector3('4079 130 4103'),
    noodle_cooking: stringToVector3('515 -52 2024'),
    komodo_fight: stringToVector3('6263.0 24 2024.0'),
    none: stringToVector3('0 0 0'),
};
export const JIP_LOCATION_MAPS = {
    spawn_room: 'NONE',
    lee_da_academy: 'NONE',
    jade_palace: 'JADE_PALACE',
    peace_valley: 'PEACE_VALLEY',
    gongmen_city: 'GONGMEN_CITY',
    panda_village: 'PANDA_VILLAGE',
    juniper_harbor: 'JUNIPER_CITY',
    juniper_castle: 'JUNIPER_CITY',
    tai_lung_1: 'NONE',
    tai_lung_2: 'NONE',
    lord_shen_1: 'NONE',
    lord_shen_2: 'NONE',
    general_kai_1: 'NONE',
    general_kai_2: 'NONE',
    chameleon_1: 'NONE',
    chameleon_2: 'NONE',
    chameleon_3: 'NONE',
    training_hall: 'NONE',
    dragon_suit_munching: 'NONE',
    wolf_thieves_peace: 'NONE',
    wolf_thieves_city: 'NONE',
    dumpling_parkour: 'NONE',
    dumpling_cooking: 'NONE',
    noodle_cooking: 'NONE',
    komodo_fight: 'NONE',
};
const SPAWN_BOX = [stringToVector3('-4000 226 70'), stringToVector3('-3984 238 80')];
export function createJip(entrypoint) {
    return new JoinInProgress(entrypoint, JIP_LOCATIONS, p => isInBounds(p.location, SPAWN_BOX[0], SPAWN_BOX[1]));
}
