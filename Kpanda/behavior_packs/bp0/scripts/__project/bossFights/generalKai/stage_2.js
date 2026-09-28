import { world, system, EntityHealthComponent, Player } from "@minecraft/server";
import { BossFightStage } from "../stage.js";
import { TitleManagerV2 } from "noxcrew.common.scripting/index.js";
import { CreateGeneralKaiS2Sequence, GeneralKaiEndFight } from "./cutscenes.js";
import { GeneralKaiFight } from "./fight.js";
import { RemoveEntityFamily, RemoveEntityType } from "../../util/removeEntity.js";
import { stringToVector3 } from "../../util/stringToVector3.js";
export class GeneralKaiStage2 extends BossFightStage {
    constructor() {
        super(...arguments);
        this.dimension = world.getDimension('overworld');
        this.titleManager = this.container.inject(TitleManagerV2);
        this.startSequence = CreateGeneralKaiS2Sequence(this.titleManager);
        this.fightLocation = 'general_kai_2';
    }
    resetStage() {
        RemoveEntityFamily(['kai_fight']);
    }
    setupStage() {
        world.getDimension('overworld').runCommandAsync(`function music/BOSS_KAI_2`);
        world.getDimension('overworld').runCommandAsync('clear @a noxcrew.kp:dragon_spirit');
        const generalKai = this.dimension.spawnEntity(GeneralKaiFight.KAI_ENTITY, { x: 0, y: 0, z: 0 });
        generalKai.teleport({ x: 4072, y: 43, z: 7976 }, { rotation: { y: 0, x: 0 } });
        generalKai.triggerEvent('noxcrew:add.stage_2');
        const bossHealth = generalKai.getComponent(EntityHealthComponent.componentId);
        bossHealth.resetToMaxValue();
        const skybox = this.dimension.spawnEntity(GeneralKaiStage2.SKYBOX_ENTITY, { x: 0, y: 0, z: 0 });
        skybox.teleport(stringToVector3('4072 32.00 7984'));
        const dragonSpirit = this.dimension.spawnEntity(GeneralKaiStage2.DRAGON_SPIRIT, { x: 0, y: 0, z: 0 });
        dragonSpirit.teleport(stringToVector3('4098 43 7984'));
        this.titleManager.addTitle({
            type: 'one-off',
            duration: 60,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.boss_kai.ab2` }] } },
        });
        world.sendMessage({ translate: 'txt.boss_kai.context2' });
    }
    setup() {
        this.listenFor(world.afterEvents.entityDie, e => {
            const deadBoss = e.deadEntity;
            if (deadBoss.typeId !== GeneralKaiFight.KAI_ENTITY)
                return;
            if (deadBoss.getProperty('noxcrew:phase') !== 2)
                return;
            RemoveEntityFamily(['kai_fight']);
            this.finishStage();
        });
        this.listenFor(system.afterEvents.scriptEventReceive, e => {
            const id = e.id;
            const message = e.message;
            const player = e.sourceEntity;
            if (!(player instanceof Player))
                return;
            if (id === 'noxcrew.kp:boss_attack') {
                switch (message) {
                    case 'jade_blade_smash':
                        this.jadeSmash(player);
                        break;
                }
            }
        });
        this.listenFor(world.afterEvents.dataDrivenEntityTrigger, e => {
            const id = e.eventId.split('.')[0];
            const event = e.eventId.split('.')[1];
            if (id != 'noxcrew:trigger')
                return;
            const entity = e.entity;
            if (event === 'damage_dragon_panda') {
                entity.applyDamage(5);
            }
        });
    }
    jadeSmash(player) {
        const generalKai = this.dimension.getEntities({
            type: GeneralKaiFight.KAI_ENTITY,
            closest: 1,
        })[0];
        const rot = (generalKai.getRotation().y + 90) * (Math.PI / 180);
        const moveX = Math.cos(rot);
        const moveZ = Math.sin(rot);
        player.applyKnockback(moveX, moveZ, 2, 1);
        player.applyDamage(5);
    }
    async onFinishStage() {
        world.getDimension('overworld').runCommandAsync('clear @a noxcrew.kp:dragon_spirit');
        await this.sequenceManager.runAndWait(GeneralKaiEndFight, this.titleManager);
        RemoveEntityType(GeneralKaiStage2.SKYBOX_ENTITY);
    }
}
GeneralKaiStage2.SKYBOX_ENTITY = 'noxcrew.kp:kai_skybox';
GeneralKaiStage2.DRAGON_SPIRIT = 'noxcrew.kp:dragon_warrior_spirit';
export function preLoadKaiStage2() { }
