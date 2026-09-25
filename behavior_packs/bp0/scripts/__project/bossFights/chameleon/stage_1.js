import { EntityHealthComponent, EntityInitializationCause, world } from "@minecraft/server";
import { BossFightStage } from "../stage.js";
import { TitleManagerV2 } from "noxcrew.common.scripting/index.js";
import { RemoveEntityFamily } from "../../util/removeEntity.js";
import { createChameleonS1Sequence } from "./cutscenes.js";
import { stringToVector3 } from "../../util/stringToVector3.js";
import { ChameleonFight } from "./fight.js";
export function preLoadChameleonStage1() {
    RemoveEntityFamily(['chameleon_fight']);
}
export class ChameleonStage1 extends BossFightStage {
    constructor() {
        super(...arguments);
        this.dimension = world.getDimension('overworld');
        this.titleManager = this.container.inject(TitleManagerV2);
        this.startSequence = createChameleonS1Sequence(this.titleManager);
        this.fightLocation = 'chameleon_1';
    }
    resetStage() {
        RemoveEntityFamily(['chameleon_fight']);
    }
    setupStage() {
        world.getDimension('overworld').runCommandAsync(`function music/BOSS_CHAMELEON_1`);
        for (const player of world.getAllPlayers())
            player.playSound('po_thunder', { location: player.location, volume: 5 });
        world
            .getDimension('overworld')
            .spawnEntity(ChameleonFight.CHAMELEON_TAI_ENTITY, stringToVector3('6198 24 4066'))
            .triggerEvent('noxcrew:attack.random');
        this.titleManager.addTitle({
            type: 'one-off',
            duration: 60,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.boss_cham.ab1` }] } },
        });
        world.sendMessage({ translate: 'txt.boss_cham.context1' });
    }
    setup() {
        this.listenFor(world.afterEvents.entityHurt, e => {
            const damager = e.damageSource.damagingEntity ?? null;
            const hurtEntity = e.hurtEntity;
            if (damager?.typeId !== ChameleonFight.CHAMELEON_TAI_ENTITY)
                return;
            const rot = (damager.getRotation().y + 90) * (Math.PI / 180);
            const moveX = Math.cos(rot);
            const moveZ = Math.sin(rot);
            if (damager.typeId === ChameleonFight.CHAMELEON_TAI_ENTITY &&
                damager.getProperty('noxcrew:attack') === 'jump_kick') {
                hurtEntity.applyKnockback(moveX, moveZ, 2, 1);
            }
        });
        this.listenFor(world.afterEvents.entityHealthChanged, e => {
            const entity = e.entity;
            if (!entity.matches({ families: ['chameleon_bosses'] }))
                return;
            const bossHealth = entity.getComponent(EntityHealthComponent.componentId);
            const currentHealth = e.newValue;
            const maxHealth = bossHealth.effectiveMax;
            const rot = (entity.getRotation().y + 90) * (Math.PI / 180);
            const moveX = Math.cos(rot);
            const moveZ = Math.sin(rot);
            let nearPlayers = world.getDimension('overworld').getPlayers({
                location: entity.location,
                maxDistance: 12,
            });
            if (currentHealth <= (70 / 100) * maxHealth && entity.typeId === ChameleonFight.CHAMELEON_TAI_ENTITY) {
                entity.triggerEvent('noxcrew:add.transform_shen');
                for (const player of nearPlayers) {
                    player.playSound('po_scared ', { location: player.location, volume: 5 });
                    player.applyKnockback(moveX, moveZ, 3, 0.5);
                }
            }
            else if (currentHealth <= (40 / 100) * maxHealth && entity.typeId === ChameleonFight.CHAMELEON_SHEN_ENTITY) {
                entity.triggerEvent('noxcrew:add.transform_kai');
                for (const player of nearPlayers) {
                    player.playSound('po_scared ', { location: player.location, volume: 5 });
                    player.applyKnockback(moveX, moveZ, 3, 0.5);
                }
            }
            else if (currentHealth <= (10 / 100) * maxHealth && entity.typeId === ChameleonFight.CHAMELEON_KAI_ENTITY) {
                entity.triggerEvent('noxcrew:add.transform_chameleon');
                for (const player of nearPlayers) {
                    player.playSound('po_scared ', { location: player.location, volume: 5 });
                    player.applyKnockback(moveX, moveZ, 3, 0.5);
                }
                this.finishStage();
            }
        });
        this.listenFor(world.afterEvents.entitySpawn, e => {
            const entity = e.entity;
            if (e.cause != EntityInitializationCause.Transformed)
                return;
            const bossHealth = entity.getComponent(EntityHealthComponent.componentId);
            const maxHealth = bossHealth.effectiveMax;
            entity.triggerEvent('noxcrew:attack.random');
            if (entity.typeId === ChameleonFight.CHAMELEON_SHEN_ENTITY) {
                bossHealth.setCurrentValue((70 / 100) * maxHealth);
            }
            else if (entity.typeId === ChameleonFight.CHAMELEON_KAI_ENTITY) {
                bossHealth.setCurrentValue((40 / 100) * maxHealth);
            }
        });
    }
}
