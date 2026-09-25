import { system, world } from "@minecraft/server";
import { SequenceManager, TitleManagerV2 } from "noxcrew.common.scripting/index.js";
import { seqActivityCountdown } from "../sequences.js";
import { ScopedTimer } from "noxcrew.common.scripting/index.js";
import { BossWolfManager } from "./bossWolf.js";
import Activity from "./activity.js";
import { stringToVector3 } from "../util/stringToVector3.js";
export class WolfActivity extends Activity {
    constructor(container, fightLocation) {
        super(container, fightLocation);
        this.fightLocation = fightLocation;
        this.sequenceManager = this.container.inject(SequenceManager);
        this.titleManager = this.container.inject(TitleManagerV2);
        this.metal_left = 20;
        this.wave = 0;
        this.enemiesLeft = 0;
        this.wolfCollectorsKilled = 0;
        this.numPlayers = 1;
        this.WOLF_LOCATIONS = this.fightLocation === 'WOLF_GONGMEN'
            ? stringToVector3(WolfActivity.GONGMEN_INFO.enemies)
            : stringToVector3(WolfActivity.VALLEY_INFO.enemies);
    }
    async onActivate() {
        super.onActivate();
        await this.sequenceManager.runAndWait(seqActivityCountdown, this);
        this.wolfSpawn();
        if (this.fightLocation == 'WOLF_GONGMEN') {
            ScopedTimer.schedule(this, WolfActivity.VOLLEY_TIMER, () => {
                this.shootArrowVollies();
            });
        }
        ScopedTimer.schedule(this, WolfActivity.TIMER_LENGTH, () => {
            this.metal_left = 0;
            this.end();
        });
        ScopedTimer.schedule(this, Math.floor(WolfActivity.TIMER_LENGTH / 2), () => {
            for (const player of world.getAllPlayers()) {
                player.sendMessage({ translate: 'txt.gs.msg1' });
                player.playSound('activity_count', { location: player.location });
            }
        });
        ScopedTimer.schedule(this, WolfActivity.TIMER_LENGTH - 600, () => {
            for (const player of world.getAllPlayers()) {
                player.sendMessage({ translate: 'txt.gs.msg2' });
                player.playSound('activity_timer_30', { location: player.location });
            }
        });
        this.actionbarHandle = this.titleManager.addTitle({
            type: 'persist',
            weight: 0,
            components: this.currentActionbar,
        });
    }
    setup() {
        this.numPlayers = world.getAllPlayers().length;
        this.listenFor(system.afterEvents.scriptEventReceive, e => {
            if (e.id == 'noxcrew.kp:collect_metal' && e.sourceEntity?.typeId == WolfActivity.COLLECTOR_ENTITY_ID) {
                this.metal_left--;
                this.titleManager.replaceTitle(this.actionbarHandle, this.currentActionbar);
                if (this.metal_left <= 0) {
                    this.end();
                }
            }
        });
        this.listenFor(world.afterEvents.entityDie, e => {
            const deadEntityId = e.deadEntity.typeId;
            if (WolfActivity.ATTACKABLE_ENTITIES.includes(deadEntityId ?? '')) {
                if (deadEntityId === WolfActivity.COLLECTOR_ENTITY_ID) {
                    this.wolfCollectorsKilled++;
                    if (this.wolfCollectorsKilled < 6) {
                        this.wolfSpawn();
                    }
                    else if (this.wolfCollectorsKilled === 6)
                        this.bossSpawn();
                }
                this.enemiesLeft--;
            }
            else if (deadEntityId === BossWolfManager.ENTITY_ID) {
                this.end();
            }
        });
    }
    onDeactivate() {
        super.onDeactivate();
        this.wolfCleanup();
        this.titleManager.removeTitle(this.actionbarHandle);
    }
    endMessage() {
        const wolfTxtId = this.fightLocation === 'WOLF_GONGMEN' ? 'wolf_gongmen' : 'wolf_peace';
        const wolfResultMsg = {
            translate: `txt.activity_${wolfTxtId}.counter`,
            with: [`${this.metal_left}`],
        };
        world.sendMessage(wolfResultMsg);
        let tier = `txt.activity_${wolfTxtId}.tier0`;
        if (this.metal_left >= 15) {
            tier = `txt.activity_${wolfTxtId}.tier3`;
        }
        else if (this.metal_left >= 10) {
            tier = `txt.activity_${wolfTxtId}.tier2`;
        }
        else if (this.metal_left >= 5) {
            tier = `txt.activity_${wolfTxtId}.tier1`;
        }
        else if (this.metal_left != 0) {
            tier = `txt.activity_${wolfTxtId}.tier0_1`;
        }
        world.sendMessage({ rawtext: [{ translate: `${tier}` }] });
    }
    wolfSpawn() {
        this.wave++;
        for (const player of world.getAllPlayers())
            player.playSound('activity_start', { location: player.location });
        let randomLoc = this.getNewSpawnLocation();
        let lastLoc = randomLoc;
        this.dimension.spawnEntity(WolfActivity.COLLECTOR_ENTITY_ID, this.WOLF_LOCATIONS[randomLoc]);
        if (this.wave > 1) {
            let spawnCount = 3 * this.numPlayers;
            for (let i = 0; i < spawnCount; ++i) {
                randomLoc = this.getNewSpawnLocation(lastLoc);
                lastLoc = randomLoc;
                this.dimension
                    .spawnEntity(WolfActivity.WARRIOR_ENTITY_ID, this.WOLF_LOCATIONS[randomLoc])
                    .triggerEvent('noxcrew:add.wolf_thief');
                this.enemiesLeft++;
            }
        }
    }
    get currentActionbar() {
        return {
            actionbar: {
                rawtext: [
                    {
                        translate: 'txt.ui.wolf.actionbar',
                        with: [String(this.metal_left)],
                    },
                ],
            },
        };
    }
    bossSpawn() {
        this.titleManager.replaceTitle(this.actionbarHandle, {
            actionbar: { rawtext: [{ translate: 'txt.activity_wolf_boss' }] },
        });
        ScopedTimer.schedule(this, 200, () => {
            this.titleManager.replaceTitle(this.actionbarHandle, this.currentActionbar);
        });
        for (const player of world.getAllPlayers())
            player.playSound('activity_start', { location: player.location });
        this.registerChild(new BossWolfManager(this.container, this.WOLF_LOCATIONS[this.getNewSpawnLocation()], `noxcrew:add.${this.fightLocation.toLowerCase()}`, this.fightLocation === 'WOLF_GONGMEN' ? WolfActivity.BOSS_ATTACK_GONGMEN : WolfActivity.BOSS_ATTACK_VALLEY));
        this.enemiesLeft++;
    }
    wolfCleanup() {
        this.dimension.getEntities({ families: ['wolf_activity_clean'] }).forEach(entity => {
            entity.triggerEvent('noxcrew:despawn');
        });
    }
    getNewSpawnLocation(lastPos = -1) {
        let loc = Math.floor(Math.random() * this.WOLF_LOCATIONS.length);
        while (loc == lastPos) {
            loc = Math.floor(Math.random() * this.WOLF_LOCATIONS.length);
        }
        return loc;
    }
    shootArrowVollies() {
        for (const area of WolfActivity.ARROW_VOLLEYS) {
            WolfActivity.summonArrowVolley(this.dimension, area[Math.floor(Math.random() * area.length)]);
        }
        ScopedTimer.schedule(this, WolfActivity.VOLLEY_TIMER, () => {
            this.shootArrowVollies();
        });
    }
    static async summonArrowVolley(dimension, pos) {
        const offsetPos = { ...pos };
        offsetPos.y += 20;
        dimension.spawnEntity(WolfActivity.VOLLEY_ARROW_ENTITY_ID, pos).applyImpulse({ x: 0, y: -0.5, z: 0 });
    }
}
WolfActivity.TIMER_LENGTH = 6000;
WolfActivity.VOLLEY_ARROW_ENTITY_ID = 'noxcrew.kp:arrow_flare';
WolfActivity.WARRIOR_ENTITY_ID = 'noxcrew.kp:warrior_wolf';
WolfActivity.COLLECTOR_ENTITY_ID = 'noxcrew.kp:wolf_collector';
WolfActivity.ATTACKABLE_ENTITIES = ['noxcrew.kp:warrior_wolf', 'noxcrew.kp:wolf_collector'];
WolfActivity.GONGMEN_INFO = {
    enemies: [
        '2115 -35 4179',
        '2127 -38 4164',
        '2149 -36 4157',
        '2156 -38 4179',
        '2155 -37 4205',
        '2127 -38 4195',
    ],
};
WolfActivity.ARROW_VOLLEYS = [
    stringToVector3(['2131 -38 4164', '2135 -38 4169', '2139 -38 4164', '2146 -38 4168', '2148 -38 4174']),
    stringToVector3(['2147 -38 4184', '2140 -38 4190', '2144 -38 4196', '2149 -38 4202', '2133 -38 4196']),
    stringToVector3(['2133 -38 4182', '2128 -38 4175', '2125 -38 4181', '2122 -36 4185', '2120 -35 4175']),
];
WolfActivity.VALLEY_INFO = {
    enemies: ['514 -52 4576', '498 -52 4594', '540 -52 4608', '555 -52 4592'],
};
WolfActivity.BOSS_ATTACK_GONGMEN = 'arrow';
WolfActivity.BOSS_ATTACK_VALLEY = 'slam';
WolfActivity.VOLLEY_TIMER = 12 * 20;
