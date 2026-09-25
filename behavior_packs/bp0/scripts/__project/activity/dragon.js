import { system, world } from "@minecraft/server";
import { DynamicProperty, ScopedTimer, SequenceManager, TitleManagerV2, } from "noxcrew.common.scripting/index.js";
import { seqActivityCountdown } from "../sequences.js";
import { EnablePlayerProperty } from "../util/tag.js";
import { createUiTrigger } from "../titles.js";
import { stringToVector3 } from "../util/stringToVector3.js";
import Activity from "./activity.js";
export class DragonActivity extends Activity {
    constructor(container) {
        super(container, 'DRAGON_DANCE');
        this.sequenceManager = this.container.inject(SequenceManager);
        this.titleManager = this.container.inject(TitleManagerV2);
        this.score = 0;
        this.roundID = (DragonActivity.MUNCHID_STORAGE.get(world) ?? 0) + 1;
    }
    setup() {
        this.registerChild(new EnablePlayerProperty(this.container, 'noxcrew:force_ride_dragon'));
        this.listenFor(world.afterEvents.entityLoad, e => {
            if (e.entity.typeId != DragonActivity.WOLF_ENTITY_ID) {
                return;
            }
            this.tryDespawnWolves(e.entity, this.roundID);
        });
        this.listenFor(world.afterEvents.playerSpawn, e => {
            if (!e.initialSpawn)
                return;
            this.spawnSuit(e.player);
        });
        this.listenFor(system.afterEvents.scriptEventReceive, e => {
            if (e.id != 'noxcrew.kp:munch_wolf')
                return;
            this.score++;
            this.titleManager.replaceTitle(this.actionbarHandle, this.munchedActionbar);
        });
    }
    async onActivate() {
        super.onActivate();
        ScopedTimer.schedule(this, 5, () => {
            for (const player of world.getAllPlayers()) {
                this.spawnSuit(player);
            }
        });
        ScopedTimer.schedule(this, 2, () => this.tick(), true);
        await this.sequenceManager.runAndWait(seqActivityCountdown, this);
        DragonActivity.MUNCHID_STORAGE.set(world, this.roundID);
        this.actionbarHandle = this.titleManager.addTitle({
            type: 'persist',
            weight: 0,
            components: this.munchedActionbar,
        });
        this.tryDespawnAllWolves(this.roundID);
        for (let i = 0; i < DragonActivity.WOLF_LOCATIONS.length; i++) {
            this.spawnWolf(i);
        }
        ScopedTimer.schedule(this, DragonActivity.TIMER_LENGTH, () => this.end());
        ScopedTimer.schedule(this, DragonActivity.TIMER_LENGTH - 600, () => {
            for (const player of world.getAllPlayers()) {
                player.sendMessage({ translate: 'txt.gs.msg2' });
                player.playSound('activity_timer_30', { location: player.location });
            }
        });
    }
    onDeactivate() {
        super.onDeactivate();
        for (const suit of world.getDimension('overworld').getEntities({ type: DragonActivity.DRAGON_SUIT_ID })) {
            suit.remove();
        }
        this.titleManager.removeTitle(this.actionbarHandle);
        this.tryDespawnAllWolves(this.roundID + 1);
    }
    endMessage() {
        const dragonResultMsg = {
            translate: `txt.activity_dragon_dance.counter`,
            with: [`${this.score}`],
        };
        world.sendMessage(dragonResultMsg);
        let tier = 'txt.activity_dragon_dance.tier0';
        if (this.score >= 25) {
            tier = 'txt.activity_dragon_dance.tier3';
        }
        else if (this.score >= 15) {
            tier = 'txt.activity_dragon_dance.tier2';
        }
        else if (this.score >= 8) {
            tier = 'txt.activity_dragon_dance.tier1';
        }
        else if (this.score != 0) {
            tier = 'txt.activity_dragon_dance.tier0_1';
        }
        world.sendMessage({ rawtext: [{ translate: `${tier}` }] });
    }
    get munchedActionbar() {
        return { actionbar: { rawtext: [{ translate: `Wolves Munched: ${this.score}`, with: [String(this.score)] }] } };
    }
    tick() {
        const dragonMunchers = this.dimension.getEntities({ type: DragonActivity.DRAGON_SUIT_ID }) ?? null;
        if (dragonMunchers == null)
            return;
        dragonMunchers.forEach(dragon => {
            dragon.getEntitiesFromViewDirection({ maxDistance: 6 }).filter(e => {
                const wolf = e.entity;
                if (wolf.typeId === DragonActivity.WOLF_ENTITY_ID && wolf.getProperty('noxcrew:knockout') != true) {
                    dragon.triggerEvent('noxcrew:set.eat.true');
                    wolf.triggerEvent('noxcrew:set.knockout.true');
                    const index = DragonActivity.SPAWN_LOCATION_INDEX.get(wolf) ?? 0;
                    ScopedTimer.schedule(this, DragonActivity.SPAWN_INTERVAL, cancel => {
                        if (this.spawnWolf(index))
                            cancel();
                    }, true);
                    const idx = Math.floor(Math.random() * DragonActivity.MUNCH_TITLES.length);
                    this.titleManager.addTitle({
                        ...DragonActivity.MUNCH_TITLES[idx],
                        targets: new Set(wolf.dimension.getPlayers({
                            location: wolf.location,
                            maxDistance: 8,
                        })),
                    });
                }
            });
        });
    }
    spawnSuit(player) {
        player.runCommandAsync(`ride @s summon_ride noxcrew.kp:dragondance_suit`);
    }
    spawnWolf(index) {
        const location = DragonActivity.WOLF_LOCATIONS[index];
        if (location == undefined)
            return;
        try {
            const entity = world
                .getDimension('overworld')
                .spawnEntity(DragonActivity.WOLF_ENTITY_ID, { x: 2101, y: -35, z: 2230 });
            DragonActivity.SPAWN_LOCATION_INDEX.set(entity, index);
            DragonActivity.MUNCHID_STORAGE.set(entity, this.roundID);
            entity.teleport(location);
            return true;
        }
        catch (ex) {
            return false;
        }
    }
    tryDespawnAllWolves(roundID) {
        for (const wolves of world.getDimension('overworld').getEntities({
            type: DragonActivity.WOLF_ENTITY_ID,
        })) {
            this.tryDespawnWolves(wolves, roundID);
        }
    }
    tryDespawnWolves(entity, roundID) {
        const wolvesID = DragonActivity.MUNCHID_STORAGE.get(entity);
        if (wolvesID != roundID) {
            entity.triggerEvent('noxcrew:despawn');
        }
    }
}
DragonActivity.WOLF_LOCATIONS = stringToVector3([
    '2101 -33 2230',
    '2124 -33 2227',
    '2142 -35 2227',
    '2148 -38 2219',
    '2169 -38 2225',
    '2193 -36 2229',
    '2216 -38 2223',
    '2229 -38 2213',
    '2242 -38 2199',
    '2238 -38 2227',
    '2225 -42 2248',
    '2232 -46 2265',
    '2239 -41 2265',
    '2224 -46 2283',
    '2259 -39 2264',
    '2224 -49 2303',
    '2211 -49 2302',
    '2196 -49 2295',
    '2187 -49 2308',
    '2175 -49 2295',
    '2160 -49 2304',
    '2142 -47 2304',
    '2147 -42 2280',
    '2125 -38 2279',
    '2108 -32 2272',
    '2092 -31 2274',
    '2074 -32 2268',
    '2074 -33 2243',
    '2078 -33 2231',
    '2077 -33 2211',
    '2121 -32 2250',
    '2149 -30 2246',
    '2169 -30 2246',
    '2200 -38 2246',
]);
DragonActivity.MUNCHID_STORAGE = new DynamicProperty('noxcrew.kp:parkour_id');
DragonActivity.SPAWN_LOCATION_INDEX = new DynamicProperty('noxcrew.kp:spawn_location_index');
DragonActivity.TIMER_LENGTH = 1800;
DragonActivity.WOLF_ENTITY_ID = 'noxcrew.kp:wolf_munchable';
DragonActivity.DRAGON_SUIT_ID = 'noxcrew.kp:dragondance_suit';
DragonActivity.SPAWN_INTERVAL = 400;
DragonActivity.MUNCH_TITLES = ['1', '2', '3'].map(i => createUiTrigger(`nox:popup_munchwolf${i}`));
