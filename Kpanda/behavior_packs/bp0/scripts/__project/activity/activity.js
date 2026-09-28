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
var _Activity_gameManager_accessor_storage;
import { GameManager } from "../game/GameManager.js";
import { Module } from "noxcrew.common.scripting/index.js";
import { world } from "@minecraft/server";
import { timeout } from "../util/timer.js";
class Activity extends Module {
    get gameManager() { return __classPrivateFieldGet(this, _Activity_gameManager_accessor_storage, "f"); }
    set gameManager(value) { __classPrivateFieldSet(this, _Activity_gameManager_accessor_storage, value, "f"); }
    constructor(container, gameKey) {
        super(container);
        this.gameKey = gameKey;
        _Activity_gameManager_accessor_storage.set(this, this.container.inject(GameManager));
        this.dimension = world.getDimension('overworld');
    }
    endMessage() {
    }
    async end() {
        this.endMessage();
        if (!this.isActive)
            throw new Error('Not active');
        for (const player of world.getAllPlayers()) {
            player.onScreenDisplay.setTitle('nox:popup_end');
            player.playSound('activity_finish', { location: player.location });
        }
        await timeout(60);
        this.gameManager.endGame();
    }
    onDeactivate() {
        this.dimension.runCommandAsync(`function music/${this.gameKey}_stop`);
    }
}
_Activity_gameManager_accessor_storage = new WeakMap();
export default Activity;
