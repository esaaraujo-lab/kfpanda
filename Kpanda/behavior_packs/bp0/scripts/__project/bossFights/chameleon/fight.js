import { BossFight } from "../fight.js";
import { ChameleonStage3 } from "./stage_3.js";
import { ChameleonStage1 } from "./stage_1.js";
import { world } from "@minecraft/server";
import { SequenceManager } from "noxcrew.common.scripting/index.js";
import { Vector3Utils } from "../../util/math/vectorUtils.js";
import { RemoveEntityFamily } from "../../util/removeEntity.js";
import { ChameleonStage2 } from "./stage_2.js";
import { timeout } from "../../util/timer.js";
export class ChameleonFight extends BossFight {
    constructor() {
        super(...arguments);
        this.dimension = world.getDimension('overworld');
        this.sequenceManager = this.container.inject(SequenceManager);
        this.thrownCages = 0;
        this.fireballs = 0;
        this.stages = [
            new ChameleonStage1(this.container, this),
            new ChameleonStage2(this.container, this),
            new ChameleonStage3(this.container, this),
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
                case 'double_punch':
                    this.doublePunch(entity);
                    break;
                case 'belly_slam':
                    this.bellySlam(entity);
                    break;
                case 'throw_fiery_cage':
                    this.throwFieryCage(entity);
                    break;
            }
        });
    }
    onDeactivate() {
        super.onDeactivate();
        RemoveEntityFamily(['chameleon_fight']);
    }
    throwFieryCage(entity) {
        const viewDirection = entity.getViewDirection();
        const throwPower = Vector3Utils.scale({ x: viewDirection.x, y: viewDirection.y + 0.2, z: viewDirection.z }, 2);
        const cage = entity.dimension.spawnEntity('noxcrew.kp:fiery_cage', entity.location);
        cage.setRotation(entity.getRotation());
        cage.applyImpulse(throwPower);
        if (++this.thrownCages > 5) {
            entity.triggerEvent('noxcrew:attack.random');
            this.thrownCages = 0;
        }
    }
    async bellySlam(entity) {
        const rot = (entity.getRotation().y + 90) * (Math.PI / 180);
        const moveX = Math.cos(rot);
        const moveZ = Math.sin(rot);
        entity.applyKnockback(moveX, moveZ, 2, 1);
        await timeout(20);
        let nearPlayers = world.getDimension('overworld').getPlayers({
            location: entity.location,
            minDistance: 0,
            maxDistance: 10,
        });
        for (const player of nearPlayers) {
            const rot = (entity.getRotation().y + 90) * (Math.PI / 180);
            const moveX = Math.cos(rot);
            const moveZ = Math.sin(rot);
            player.applyKnockback(moveX, moveZ, 2, 1);
            player.applyDamage(5);
        }
        await timeout(5);
        entity.triggerEvent('noxcrew:attack.tounge');
    }
    async doublePunch(entity) {
        await timeout(23);
        let nearPlayers = world.getDimension('overworld').getPlayers({
            location: entity.location,
            maxDistance: 10,
        });
        for (const player of nearPlayers) {
            const rot = (entity.getRotation().y + 90) * (Math.PI / 180);
            const moveX = Math.cos(rot);
            const moveZ = Math.sin(rot);
            player.applyKnockback(moveX, moveZ, 2, 1);
            player.applyDamage(5);
        }
        await timeout(5);
        entity.triggerEvent('noxcrew:attack.random');
    }
}
ChameleonFight.CHAMELEON_ENTITY = 'noxcrew.kp:chameleon';
ChameleonFight.CHAMELEON_TAI_ENTITY = 'noxcrew.kp:chameleon_tai';
ChameleonFight.CHAMELEON_SHEN_ENTITY = 'noxcrew.kp:chameleon_shen';
ChameleonFight.CHAMELEON_KAI_ENTITY = 'noxcrew.kp:chameleon_kai';
ChameleonFight.CHAMELEON_PO_ENTITY = 'noxcrew.kp:chameleon_po';
ChameleonFight.CHAMELEON_DRAGON_ENTITY = 'noxcrew.kp:chameleon_dragon';
ChameleonFight.CHAMELEON_ENTITY_CUTSCENE = 'noxcrew.kp:chameleon_cutscene';
