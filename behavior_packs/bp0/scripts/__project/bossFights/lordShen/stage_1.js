import { world } from "@minecraft/server";
import { BossFightStage } from "../stage.js";
import { ScopedTimer, TitleManagerV2 } from "noxcrew.common.scripting/index.js";
import { CreateLordShenS1Sequence } from "./cutscenes.js";
import { RemoveEntityFamily } from "../../util/removeEntity.js";
import { GameManager } from "../../game/GameManager.js";
export class LordShenStage1 extends BossFightStage {
    constructor() {
        super(...arguments);
        this.dimension = world.getDimension('overworld');
        this.titleManager = this.container.inject(TitleManagerV2);
        this.gameManager = this.container.inject(GameManager);
        this.randomLoc = -1;
        this.lastLoc = -1;
        this.enemiesLeft = 0;
        this.boatsLeft = 4;
        this.seconds = 0;
        this.wolfSecs = 0;
        this.waves = 0;
        this.stage = 0;
        this.timeLimit = LordShenStage1.STAGE_1_TIME;
        this.startSequence = CreateLordShenS1Sequence(this.titleManager, preLoadShenStage1);
        this.fightLocation = 'lord_shen_1';
    }
    resetStage() {
        RemoveEntityFamily(['lord_shen_fight']);
    }
    setupStage() {
        this.dimension.runCommand('clear @a noxcrew.kp:axe');
        world.getDimension('overworld').runCommandAsync(`function music/BOSS_SHEN_1`);
        ScopedTimer.schedule(this, 20, () => this.incrementSeconds(), true);
        ScopedTimer.schedule(this, 20, cancel => this.wolfSpawnIncrement(cancel), true);
        for (const baits of LordShenStage1.BAIT_LOCATIONS) {
            const bait = this.dimension.spawnEntity(LordShenStage1.BAIT_ENTITY, { x: 0, y: 0, z: 0 });
            bait.setProperty('noxcrew.kp:location', baits.property);
            bait.teleport(baits.location);
        }
        this.spawnAxes();
        this.spawnWolfGroups();
        this.titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.boss_shen.ab1` }] } },
        });
        world.sendMessage({ translate: 'txt.boss_shen.context1' });
    }
    setup() {
        this.listenFor(world.afterEvents.entityDie, e => {
            const deadEntity = e.deadEntity;
            if (deadEntity.typeId === LordShenStage1.WOLVES_ENTITY) {
                this.enemiesLeft--;
                if (this.enemiesLeft === 0) {
                    ScopedTimer.schedule(this, 100, () => this.spawnWolfGroups(), false);
                }
            }
        });
        this.listenFor(world.afterEvents.projectileHitEntity, e => {
            const hitEntity = e.getEntityHit().entity;
            const damagerEntity = e.projectile;
            if (hitEntity === undefined)
                return;
            if (damagerEntity.typeId !== 'noxcrew.kp:projectile_axe' ||
                !(LordShenStage1.FURIOUS_BOAT_ENTITY || LordShenStage1.BOAT_ENTITY))
                return;
            const canSink = hitEntity.getProperty('noxcrew:can_sink');
            const sunk = hitEntity.getProperty('noxcrew:sink');
            if (hitEntity.typeId === LordShenStage1.FURIOUS_BOAT_ENTITY) {
                if (sunk)
                    return;
                this.unlockStep2(hitEntity);
            }
            else if (hitEntity.typeId === LordShenStage1.BOAT_ENTITY) {
                if (!canSink || sunk)
                    return;
                const damage = hitEntity.getProperty('noxcrew:damage');
                if (damage != 0) {
                    hitEntity.setProperty('noxcrew:damage', damage - 1);
                }
                else {
                    this.boatsLeft--;
                    hitEntity.triggerEvent('noxcrew:to.transform_sinking');
                    if (this.boatsLeft === 0) {
                        this.dimension.runCommand('clear @a noxcrew.kp:axe');
                        this.dimension.runCommandAsync('tickingarea remove shen.canal');
                        for (const player of world.getAllPlayers())
                            player.playSound('po_random', { location: player.location, volume: 5 });
                        this.finishStage();
                    }
                }
            }
        });
    }
    unlockStep2(entity) {
        entity.triggerEvent('noxcrew:to.transform_sinking');
        this.stage = 1;
        this.seconds = 0;
        this.timeLimit = LordShenStage1.STAGE_2_TIME;
        let boats = world.getDimension('overworld').getEntities({
            families: ['canal_boats'],
        });
        for (const entity of boats) {
            let locNum = entity.getProperty('noxcrew.kp:location');
            entity.setProperty('noxcrew.kp:location', locNum + 10);
            entity.setRotation({ y: 90, x: 0 });
            if (entity.typeId === LordShenStage1.BOAT_ENTITY) {
                entity.setProperty('noxcrew:can_sink', true);
                entity.setProperty('noxcrew:sail_down', true);
            }
        }
        this.titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.boss_shen.ab2` }] } },
        });
        world.sendMessage({ translate: 'txt.boss_shen.context2' });
        for (const player of world.getAllPlayers())
            player.playSound('po_random', { location: player.location, volume: 5 });
    }
    async incrementSeconds() {
        this.seconds++;
        if (this.seconds === 60 && this.stage === 0) {
            world.sendMessage({ translate: 'txt.boss_shen.warning1' });
        }
        else if (this.seconds === 60 && this.stage === 1) {
            world.sendMessage({ translate: 'txt.boss_shen.warning2' });
        }
        if (this.seconds >= this.timeLimit) {
            this.titleManager.addTitle({
                type: 'one-off',
                duration: 1,
                weight: 0,
                components: { title: { text: 'nox:boss_out_fail' } },
            });
            this.gameManager.endGame();
        }
    }
    wolfSpawnIncrement(cancel) {
        this.wolfSecs++;
        if (this.wolfSecs == 300)
            return cancel();
    }
    spawnWolfGroups() {
        this.randomLoc = this.getNewSpawnLocation(this.lastLoc);
        this.lastLoc = this.randomLoc;
        const group = LordShenStage1.WOLF_GROUPS[this.randomLoc];
        if (this.wolfSecs >= group.spawnTime.min && this.wolfSecs <= group.spawnTime.max) {
            this.waves++;
            for (const locs of group.spawnLocs) {
                this.dimension.spawnEntity(LordShenStage1.WOLVES_ENTITY, locs).triggerEvent('noxcrew:add.wolf_lord_shen');
                this.enemiesLeft++;
            }
        }
        else
            this.spawnWolfGroups();
    }
    spawnAxes() {
        for (const axes of LordShenStage1.AXE_PILES_LOCATIONS) {
            const axe = this.dimension.spawnEntity(LordShenStage1.AXE_PILE_ENTITY, { x: 0, y: 0, z: 0 });
            axe.teleport(axes.location, { rotation: axes.rotation });
        }
    }
    getNewSpawnLocation(lastPos) {
        let loc = Math.floor(Math.random() * LordShenStage1.WOLF_GROUPS.length);
        while (loc == lastPos) {
            loc = Math.floor(Math.random() * LordShenStage1.WOLF_GROUPS.length);
        }
        return loc;
    }
}
LordShenStage1.STAGE_1_TIME = 120;
LordShenStage1.STAGE_2_TIME = 120;
LordShenStage1.WOLF_GROUPS = [
    {
        spawnTime: { min: 0, max: 60 },
        spawnLocs: [
            { x: 2204, y: -48, z: 6128 },
            { x: 2205, y: -48, z: 6130 },
            { x: 2203, y: -48, z: 6130 },
        ],
    },
    {
        spawnTime: { min: 0, max: 60 },
        spawnLocs: [
            { x: 2214, y: -45, z: 6135 },
            { x: 2216, y: -45, z: 6134 },
            { x: 2216, y: -45, z: 6136 },
        ],
    },
    {
        spawnTime: { min: 0, max: 90 },
        spawnLocs: [
            { x: 2191, y: -45, z: 6134 },
            { x: 2188, y: -45, z: 6135 },
            { x: 2190, y: -45, z: 6137 },
        ],
    },
    {
        spawnTime: { min: 30, max: 120 },
        spawnLocs: [
            { x: 2170, y: -45, z: 6135 },
            { x: 2171, y: -45, z: 6137 },
            { x: 2169, y: -45, z: 6137 },
        ],
    },
    {
        spawnTime: { min: 60, max: 150 },
        spawnLocs: [
            { x: 2150, y: -42, z: 6133 },
            { x: 2148, y: -42, z: 6133 },
            { x: 2149, y: -42, z: 6135 },
        ],
    },
    {
        spawnTime: { min: 90, max: 180 },
        spawnLocs: [
            { x: 2126, y: -42, z: 6130 },
            { x: 2124, y: -42, z: 6130 },
            { x: 2125, y: -42, z: 6132 },
        ],
    },
    {
        spawnTime: { min: 150, max: 210 },
        spawnLocs: [
            { x: 2111, y: -42, z: 6128 },
            { x: 2112, y: -42, z: 6130 },
            { x: 2110, y: -42, z: 6130 },
        ],
    },
    {
        spawnTime: { min: 150, max: 300 },
        spawnLocs: [
            { x: 2100, y: -42, z: 6129 },
            { x: 2098, y: -42, z: 6128 },
            { x: 2098, y: -42, z: 6130 },
        ],
    },
    {
        spawnTime: { min: 150, max: 300 },
        spawnLocs: [
            { x: 2081, y: -42, z: 6133 },
            { x: 2083, y: -42, z: 6133 },
            { x: 2082, y: -42, z: 6135 },
        ],
    },
];
LordShenStage1.AXE_PILES_LOCATIONS = [
    { location: { x: 2222, y: -45, z: 6136 }, rotation: { y: 90, x: 0 } },
    { location: { x: 2184, y: -45, z: 6136 }, rotation: { y: -90, x: 0 } },
    { location: { x: 2209, y: -45, z: 6140 }, rotation: { y: 180, x: 0 } },
    { location: { x: 2196, y: -45, z: 6140 }, rotation: { y: 180, x: 0 } },
    { location: { x: 2165, y: -45, z: 6134 }, rotation: { y: 180, x: 0 } },
    { location: { x: 2146, y: -45, z: 6134 }, rotation: { y: -90, x: 0 } },
    { location: { x: 2129, y: -42, z: 6132 }, rotation: { y: 180, x: 0 } },
    { location: { x: 2082, y: -42, z: 6132 }, rotation: { y: -90, x: 0 } },
    { location: { x: 2067, y: -42, z: 6131 }, rotation: { y: 180, x: 0 } },
    { location: { x: 2045, y: -42, z: 6135 }, rotation: { y: 90, x: 0 } },
];
LordShenStage1.BOAT_LOCATIONS = [
    { location: { x: 2204, y: -50, z: 6121 }, facing: { x: 2155, y: -50, z: 6121 }, event: 'noxcrew:add.baits_X2' },
    { location: { x: 2204, y: -50, z: 6110 }, facing: { x: 2155, y: -50, z: 6110 }, event: 'noxcrew:add.baits_X1' },
    { location: { x: 2184, y: -50, z: 6121 }, facing: { x: 2155, y: -50, z: 6121 }, event: 'noxcrew:add.baits_X2' },
    { location: { x: 2184, y: -50, z: 6110 }, facing: { x: 2155, y: -50, z: 6110 }, event: 'noxcrew:add.baits_X1' },
];
LordShenStage1.BAIT_LOCATIONS = [
    {
        property: 13,
        location: { x: 2169, y: -51, z: 6115 },
    },
    {
        property: 11,
        location: { x: 2155, y: -51, z: 6110 },
    },
    {
        property: 12,
        location: { x: 2155, y: -51, z: 6121 },
    },
    {
        property: 23,
        location: { x: 2155, y: -51, z: 6115 },
    },
    {
        property: 21,
        location: { x: 2141, y: -51, z: 6110 },
    },
    {
        property: 22,
        location: { x: 2141, y: -51, z: 6121 },
    },
    {
        property: 33,
        location: { x: 2141, y: -51, z: 6115 },
    },
    {
        property: 31,
        location: { x: 2127, y: -51, z: 6110 },
    },
    {
        property: 32,
        location: { x: 2127, y: -51, z: 6121 },
    },
    {
        property: 43,
        location: { x: 2127, y: -51, z: 6115 },
    },
    {
        property: 41,
        location: { x: 2113, y: -51, z: 6110 },
    },
    {
        property: 42,
        location: { x: 2113, y: -51, z: 6121 },
    },
    {
        property: 53,
        location: { x: 2113, y: -51, z: 6115 },
    },
    {
        property: 51,
        location: { x: 2099, y: -51, z: 6110 },
    },
    {
        property: 52,
        location: { x: 2099, y: -51, z: 6121 },
    },
    {
        property: 63,
        location: { x: 2099, y: -51, z: 6115 },
    },
    {
        property: 61,
        location: { x: 2085, y: -51, z: 6110 },
    },
    {
        property: 62,
        location: { x: 2085, y: -51, z: 6121 },
    },
    {
        property: 73,
        location: { x: 2085, y: -51, z: 6115 },
    },
    {
        property: 71,
        location: { x: 2066, y: -51, z: 6110 },
    },
    {
        property: 72,
        location: { x: 2066, y: -51, z: 6121 },
    },
    {
        property: 83,
        location: { x: 2066, y: -51, z: 6115 },
    },
];
LordShenStage1.AXE_PILE_ENTITY = 'noxcrew.kp:axe_pile';
LordShenStage1.BOAT_ENTITY = 'noxcrew.kp:canal_boats';
LordShenStage1.BAIT_ENTITY = 'noxcrew.kp:boat_bait';
LordShenStage1.SHENS_BOAT_ENTITY = 'noxcrew.kp:shen_boat';
LordShenStage1.FURIOUS_BOAT_ENTITY = 'noxcrew.kp:furious_boat';
LordShenStage1.WOLVES_ENTITY = 'noxcrew.kp:warrior_wolf';
export function preLoadShenStage1() {
    world.getDimension('overworld').runCommandAsync('tickingarea add 2064 -55 6096 2271 -47 6143 shen.canal');
    RemoveEntityFamily(['lord_shen_scene']);
    for (const boats of LordShenStage1.BOAT_LOCATIONS) {
        const boat = world.getDimension('overworld').spawnEntity(LordShenStage1.BOAT_ENTITY, { x: 0, y: 0, z: 0 });
        boat.setRotation({ y: 90, x: 0 });
        boat.teleport(boats.location, { facingLocation: boats.facing });
        boat.triggerEvent(boats.event);
    }
    const furiousBoat = world
        .getDimension('overworld')
        .spawnEntity(LordShenStage1.FURIOUS_BOAT_ENTITY, { x: 0, y: 0, z: 0 });
    furiousBoat.setRotation({ y: 90, x: 0 });
    furiousBoat.teleport({ x: 2164, y: -50.8, z: 6115 }, { facingLocation: { x: 2155, y: -50, z: 6115 } });
    const shenBoat = world.getDimension('overworld').spawnEntity(LordShenStage1.SHENS_BOAT_ENTITY, { x: 0, y: 0, z: 0 });
    shenBoat.setRotation({ y: 90, x: 0 });
    shenBoat.teleport({ x: 2231, y: -50.8, z: 6115 }, { facingLocation: { x: 2169, y: -50, z: 6115 } });
}
