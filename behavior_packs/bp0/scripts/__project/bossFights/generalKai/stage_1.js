import { EntityHealthComponent, world } from "@minecraft/server";
import { BossFightStage } from "../stage.js";
import { ScopedTimer, TitleManagerV2, property } from "noxcrew.common.scripting/index.js";
import { CreateGeneralKaiS1Sequence } from "./cutscenes.js";
import { GeneralKaiFight } from "./fight.js";
import { RemoveEntityFamily } from "../../util/removeEntity.js";
import { stringToVector3 } from "../../util/stringToVector3.js";
export class GeneralKaiStage1 extends BossFightStage {
    constructor() {
        super(...arguments);
        this.dimension = world.getDimension('overworld');
        this.titleManager = this.container.inject(TitleManagerV2);
        this.enemiesLeft = 0;
        this.waves = 0;
        this.triggeredPandaWave1 = 0;
        this.triggeredPandaWave2 = false;
        this.TEMP_LOCS = [];
        this.JOMBIE_SPAWN_LOCS = stringToVector3(['4087 127 6098', '4084 127 6105', '4085 130 6118']);
        this.startSequence = CreateGeneralKaiS1Sequence(this.titleManager);
        this.fightLocation = 'general_kai_1';
    }
    summonJombieWave() {
        this.TEMP_LOCS = [...this.JOMBIE_SPAWN_LOCS];
        for (const player of world.getAllPlayers()) {
            player.playSound('po_jombies', { location: player.location, volume: 5 });
        }
        for (const jombie of GeneralKaiStage1.JOMBIE_WAVES[this.waves].entities) {
            const d = Math.floor(Math.random() * this.TEMP_LOCS.length);
            const jombieSpawn = this.TEMP_LOCS[d];
            const index = this.TEMP_LOCS.indexOf(this.TEMP_LOCS[d]);
            if (index > -1) {
                this.TEMP_LOCS.splice(index, 1);
            }
            this.dimension.spawnEntity(jombie, jombieSpawn);
            this.enemiesLeft++;
        }
        this.waves++;
    }
    fireworkCrates() {
        for (const fireworks of GeneralKaiStage1.FIREWORK_CRATE_LOCATIONS) {
            const firework = this.dimension.spawnEntity(GeneralKaiStage1.FIREWORK_CRATE_ENTITY, { x: 0, y: 0, z: 0 });
            firework.teleport(fireworks.location, { rotation: fireworks.rotation });
        }
    }
    resetStage() {
        RemoveEntityFamily(['kai_fight']);
    }
    setupStage() {
        world.getDimension('overworld').runCommandAsync(`function music/BOSS_KAI_1`);
        world.getDimension('overworld').runCommandAsync('clear @a noxcrew.kp:fireworks');
        world.getDimension('overworld').runCommandAsync('clear @a noxcrew.kp:dragon_spirit');
        const generalKai = world.getDimension('overworld').spawnEntity(GeneralKaiFight.KAI_ENTITY, { x: 0, y: 0, z: 0 });
        generalKai.teleport({ x: 4083, y: 138, z: 6100 }, { rotation: { y: 270, x: 0 } });
        generalKai.triggerEvent('noxcrew:add.stage_1');
        const bossHealth = generalKai.getComponent(EntityHealthComponent.componentId);
        bossHealth.resetToMaxValue();
        this.fireworkCrates();
        this.summonJombieWave();
        this.titleManager.addTitle({
            type: 'one-off',
            duration: 60,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.boss_kai.ab1` }] } },
        });
        world.sendMessage({ translate: 'txt.boss_kai.context1' });
    }
    setup() {
        this.listenFor(world.afterEvents.entityDie, e => {
            const deadEntity = e.deadEntity;
            if (deadEntity.typeId == 'noxcrew.kp:projectile_fireworks' || deadEntity.typeId == GeneralKaiFight.KAI_ENTITY)
                return;
            if (deadEntity.matches({ families: ['jombie'] })) {
                const generalKai = this.dimension.getEntities({
                    type: GeneralKaiFight.KAI_ENTITY,
                })[0];
                const bossHealth = generalKai.getComponent(EntityHealthComponent.componentId);
                const currentHealth = bossHealth.currentValue;
                if (deadEntity.matches({ families: ['12.5%'] })) {
                    bossHealth.setCurrentValue(currentHealth - 125);
                }
                else {
                    bossHealth.setCurrentValue(currentHealth - 100);
                }
                if (bossHealth.currentValue <= 750 && this.triggeredPandaWave1 < 1) {
                    this.triggeredPandaWave1 += 1;
                    ScopedTimer.schedule(this, 600, () => {
                        this.titleManager.addTitle({
                            type: 'one-off',
                            duration: 40,
                            weight: 0,
                            components: { actionbar: { rawtext: [{ translate: `txt.boss_kai.ab3` }] } },
                        });
                        const rollingPanda = this.dimension.spawnEntity(GeneralKaiStage1.ROLLING_PANDAS_ENTITY, {
                            x: 0,
                            y: 0,
                            z: 0,
                        });
                        rollingPanda.teleport({ x: 4138, y: 133, z: 6130 }, { facingLocation: { x: 4079, y: 1127, z: 6100 } });
                        for (const player of world.getAllPlayers())
                            player.playSound('po_spring_roll', { location: player.location, volume: 5 });
                    }, true);
                }
                if (bossHealth.currentValue <= 550 && !this.triggeredPandaWave2) {
                    this.triggeredPandaWave2 = true;
                    this.titleManager.addTitle({
                        type: 'one-off',
                        duration: 40,
                        weight: 0,
                        components: { actionbar: { rawtext: [{ translate: `txt.boss_kai.ab5` }] } },
                    });
                    const fireworkPanda = this.dimension.spawnEntity(GeneralKaiStage1.FIREWORK_PANDAS_ENTITY, {
                        x: 0,
                        y: 0,
                        z: 0,
                    });
                    fireworkPanda.teleport(stringToVector3('4114 136 6131'), { rotation: { y: 180, x: 0 } });
                    this.titleManager.addTitle({
                        type: 'one-off',
                        duration: 40,
                        weight: 0,
                        components: { actionbar: { rawtext: [{ translate: `txt.boss_kai.ab4` }] } },
                    });
                    for (const player of world.getAllPlayers()) {
                        player.playSound('po_big_fun', { location: player.location, volume: 5 });
                    }
                    const bigFun = this.dimension.spawnEntity(GeneralKaiStage1.BIG_FUN_ENTITY, {
                        x: 0,
                        y: 0,
                        z: 0,
                    });
                    bigFun.triggerEvent('noxcrew:add.hug_jombie');
                    bigFun.teleport(stringToVector3('4113 131 6127'), { rotation: { y: 180, x: 0 } });
                }
                this.enemiesLeft--;
                if (this.enemiesLeft !== 0)
                    return;
                if (this.waves !== 4) {
                    this.summonJombieWave();
                }
                else {
                    world.getDimension('overworld').runCommandAsync('clear @a noxcrew.kp:fireworks');
                    generalKai.remove();
                    this.finishStage();
                }
            }
        });
        this.listenFor(world.afterEvents.entityHurt, e => {
            const damager = e.damageSource.damagingEntity;
            const hurtEntity = e.hurtEntity;
            if (!damager)
                return;
            if (damager.typeId == 'noxcrew.kp:jombie_gorilla' ||
                damager.typeId == 'noxcrew.kp:jombie_boar' ||
                (damager.typeId == 'noxcrew.kp:jombie_chicken' && damager.getProperty(GeneralKaiStage1.SPIN_PROPERTY) === true)) {
                const rot = (damager.getRotation().y + 90) * (Math.PI / 180);
                const moveX = Math.cos(rot);
                const moveZ = Math.sin(rot);
                hurtEntity.applyKnockback(moveX, moveZ, 2, 1);
                if (damager.typeId == 'noxcrew.kp:jombie_boar')
                    damager.triggerEvent('noxcrew:attack.normal');
            }
        });
    }
}
GeneralKaiStage1.SPIN_PROPERTY = property('noxcrew:spin');
GeneralKaiStage1.FIREWORK_CRATE_ENTITY = 'noxcrew.kp:firework_crate';
GeneralKaiStage1.FIREWORK_PANDAS_ENTITY = 'noxcrew.kp:firework_panda';
GeneralKaiStage1.BIG_FUN_ENTITY = 'noxcrew.kp:big_fun_fight';
GeneralKaiStage1.ROLLING_PANDAS_ENTITY = 'noxcrew.kp:roll_panda';
GeneralKaiStage1.FIREWORK_CRATE_LOCATIONS = [
    { location: { x: 4134, y: 133, z: 6119 }, rotation: { y: 0, x: 0 } },
    { location: { x: 4123, y: 133, z: 6130 }, rotation: { y: 0, x: 0 } },
    { location: { x: 4096, y: 128, z: 6119 }, rotation: { y: 0, x: 0 } },
];
GeneralKaiStage1.JOMBIE_WAVES = [
    { entities: ['noxcrew.kp:jombie_badger', 'noxcrew.kp:jombie_badger'] },
    { entities: ['noxcrew.kp:jombie_bear', 'noxcrew.kp:jombie_croc'] },
    { entities: ['noxcrew.kp:jombie_gorilla', 'noxcrew.kp:jombie_chicken'] },
    { entities: ['noxcrew.kp:jombie_boar', 'noxcrew.kp:jombie_boar', 'noxcrew.kp:jombie_porcupine'] },
];
export function preLoadKaiStage1() { }
