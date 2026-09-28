import { BossFight } from "../fight.js";
import { TaiLungStage2 } from "./stage_2.js";
import { TaiLungStage1 } from "./stage_1.js";
import { world } from "@minecraft/server";
import { SequenceManager } from "noxcrew.common.scripting/index.js";
import { RemoveEntityFamily } from "../../util/removeEntity.js";
import { timeout } from "../../util/timer.js";
export class TaiLungFight extends BossFight {
    constructor() {
        super(...arguments);
        this.dimension = world.getDimension('overworld');
        this.sequenceManager = this.container.inject(SequenceManager);
        this.stages = [
            new TaiLungStage1(this.container, this),
            new TaiLungStage2(this.container, this),
        ];
    }
    setup() {
        this.listenFor(world.afterEvents.dataDrivenEntityTrigger, e => {
            const id = e.eventId.split('.')[0];
            const event = e.eventId.split('.')[1];
            if (id != 'noxcrew:attack')
                return;
            const entity = e.entity;
            switch (event) {
                case 'pounce_strike':
                    this.pounceStrike(entity);
                    break;
                case 'double_punch':
                    this.doublePunch(entity);
                    break;
            }
        });
        this.listenFor(world.afterEvents.entityHurt, e => {
            const damager = e.damageSource.damagingEntity ?? null;
            const hurtEntity = e.hurtEntity;
            if (damager?.typeId !== TaiLungFight.TAILUNG_ENTITY)
                return;
            const rot = (damager.getRotation().y + 90) * (Math.PI / 180);
            const moveX = Math.cos(rot);
            const moveZ = Math.sin(rot);
            if (damager.typeId === TaiLungFight.TAILUNG_ENTITY && damager.getProperty('noxcrew:attack') === 'jump_kick') {
                hurtEntity.applyKnockback(moveX, moveZ, 2, 1);
            }
        });
        this.listenFor(world.afterEvents.entityHitEntity, e => {
            const damager = e.damagingEntity ?? null;
            const hitEntity = e.hitEntity;
            if (damager.typeId === TaiLungFight.TAILUNG_ENTITY && damager.getProperty('noxcrew:attack') === 'brazier') {
                hitEntity.triggerEvent('noxcrew:add.broken');
                damager.triggerEvent('noxcrew:set.invulnerable_timer');
                damager.triggerEvent('noxcrew:attack.flame_swipe');
            }
        });
    }
    onDeactivate() {
        super.onDeactivate();
        RemoveEntityFamily(['tai_lung_fight']);
    }
    async pounceStrike(entity) {
        try {
            const rot = (entity.getRotation().y + 90) * (Math.PI / 180);
            const moveX = Math.cos(rot);
            const moveZ = Math.sin(rot);
            entity.applyKnockback(moveX, moveZ, 2, 1);
            await timeout(11);
            let nearPlayers = this.dimension.getPlayers({
                location: entity.location,
                maxDistance: 6,
            });
            nearPlayers.forEach(player => {
                player.applyDamage(5);
            });
            entity.triggerEvent('noxcrew:pick_attack.phase_2');
        }
        catch (error) { }
    }
    async doublePunch(entity) {
        try {
            let nearPlayers = world.getDimension('overworld').getPlayers({
                location: entity.location,
                maxDistance: 6,
            });
            await timeout(23);
            for (const player of nearPlayers) {
                const rot = (entity.getRotation().y + 90) * (Math.PI / 180);
                const moveX = Math.cos(rot);
                const moveZ = Math.sin(rot);
                player.applyKnockback(moveX, moveZ, 2, 1);
                player.applyDamage(5);
            }
            await timeout(5);
            entity.triggerEvent('noxcrew:pick_attack.phase_2');
        }
        catch (error) { }
    }
}
TaiLungFight.TAILUNG_ENTITY = 'noxcrew.kp:tai_lung';
