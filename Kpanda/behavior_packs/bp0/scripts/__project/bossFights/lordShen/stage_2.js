import { system, world } from "@minecraft/server";
import { BossFightStage } from "../stage.js";
import { ScopedTimer, TitleManagerV2, property } from "noxcrew.common.scripting/index.js";
import { CreateLordShenS2Sequence, LordShenEndFight } from "./cutscenes.js";
import { RemoveEntityFamily } from "../../util/removeEntity.js";
import { stringToVector3 } from "../../util/stringToVector3.js";
export class LordShenStage2 extends BossFightStage {
    constructor() {
        super(...arguments);
        this.dimension = world.getDimension('overworld');
        this.titleManager = this.container.inject(TitleManagerV2);
        this.shenCurrentLoc = 0;
        this.startSequence = CreateLordShenS2Sequence(this.titleManager, preLoadShenStage2);
        this.fightLocation = 'lord_shen_2';
    }
    setupStage() {
        world.getDimension('overworld').runCommandAsync(`function music/BOSS_SHEN_2`);
        const lordShen = this.dimension.spawnEntity(LordShenStage2.SHEN_ENTITY, { x: 0, y: 0, z: 0 });
        lordShen.teleport(LordShenStage2.SHEN_LOCATION[0].location, { rotation: LordShenStage2.SHEN_LOCATION[0].rotation });
        const shenCannon = this.dimension.spawnEntity(LordShenStage2.SHEN_CANNON_ENTITY, { x: 0, y: 0, z: 0 });
        shenCannon.teleport({ x: 1988.0, y: -48, z: 8120.0 }, { rotation: { y: 90, x: 0 } });
        for (const cannons of LordShenStage2.CANNON_LOCATIONS) {
            const cannon = this.dimension.spawnEntity(LordShenStage2.CANNON_ENTITY, { x: 0, y: 0, z: 0 });
            cannon.teleport(cannons.location, { rotation: cannons.rotation });
            cannon.setDynamicProperty(LordShenStage2.CANNON_SIDE, cannons.side);
            if (cannons.side === 0) {
                cannon.triggerEvent('noxcrew:set.active.true');
            }
            else {
                cannon.triggerEvent('noxcrew:to.cooldown');
            }
        }
        this.titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.boss_shen.ab3` }] } },
        });
        world.sendMessage({ translate: 'txt.boss_shen.context3' });
    }
    resetStage() {
        RemoveEntityFamily(['lord_shen_fight']);
    }
    setup() {
        ScopedTimer.schedule(this, 20, () => {
            const lordShen = world.getDimension('overworld').getEntities({
                type: LordShenStage2.SHEN_ENTITY,
                closest: 1,
            })[0];
            if (!lordShen)
                return;
            const block = lordShen.dimension.getBlock(lordShen.location)?.below(1);
            if (block?.permutation.matches('water')) {
                const shenLoc = this.shenCurrentLoc === 0 ? 1 : 0;
                const platform = LordShenStage2.SHEN_LOCATION[shenLoc];
                lordShen.teleport(platform.location, { rotation: platform.rotation });
            }
        }, true);
        this.listenFor(world.afterEvents.entityDie, e => {
            const deadBoss = e.deadEntity.typeId;
            if (deadBoss !== LordShenStage2.SHEN_ENTITY)
                return;
            RemoveEntityFamily(['lord_shen_fight']);
            this.finishStage();
        });
        this.listenFor(world.afterEvents.dataDrivenEntityTrigger, e => {
            const id = e.eventId.split('.')[0];
            const event = e.eventId.split('.')[1];
            if (id != 'noxcrew:to')
                return;
            const entity = e.entity;
            if (event === 'shoot') {
                entity.dimension
                    .spawnEntity(LordShenStage2.CANNON_BALL_ENTITY, entity.location)
                    .applyImpulse(entity.getViewDirection());
                entity.setProperty('noxcrew:shoot', false);
            }
        });
        this.listenFor(system.afterEvents.scriptEventReceive, e => {
            const id = e.id;
            if (id == 'noxcrew.kp:jump_timer') {
                const lordShen = e.sourceEntity;
                if (!lordShen)
                    return;
                ScopedTimer.schedule(this, 300, () => this.jump(lordShen), false);
            }
        });
    }
    jump(lordShen) {
        try {
            lordShen.triggerEvent('noxcrew:attack.jump');
            ScopedTimer.schedule(this, 10, cancel => {
                const shenLoc = this.shenCurrentLoc === 0 ? 1 : 0;
                this.shenCurrentLoc = shenLoc;
                const platform = LordShenStage2.SHEN_LOCATION[shenLoc];
                try {
                    lordShen.teleport(platform.location, { rotation: platform.rotation });
                    lordShen.triggerEvent('noxcrew:attack.dagger_throw');
                    lordShen.setProperty('noxcrew:jump_trigger', false);
                }
                catch (error) { }
            });
        }
        catch (error) { }
    }
    async onFinishStage() {
        await this.sequenceManager.runAndWait(LordShenEndFight, this.titleManager);
        for (const player of world.getAllPlayers())
            player.teleport(stringToVector3('2251 -41 270'));
    }
}
LordShenStage2.CANNON_SIDE = property('noxcrew:side');
LordShenStage2.SHEN_ENTITY = 'noxcrew.kp:lord_shen';
LordShenStage2.SHEN_CANNON_ENTITY = 'noxcrew.kp:shen_cannon';
LordShenStage2.CANNON_ENTITY = 'noxcrew.kp:canal_cannons';
LordShenStage2.CANNON_BALL_ENTITY = 'noxcrew.kp:cannon_balls';
LordShenStage2.CANNON_LOCATIONS = [
    { location: { x: 1972, y: -49, z: 8102 }, rotation: { y: 0, x: 0 }, side: 0 },
    { location: { x: 1964, y: -49, z: 8102 }, rotation: { y: 0, x: 0 }, side: 0 },
    { location: { x: 1968, y: -49, z: 8136 }, rotation: { y: 180, x: 0 }, side: 1 },
    { location: { x: 1960, y: -49, z: 8135 }, rotation: { y: 180, x: 0 }, side: 1 },
];
LordShenStage2.SHEN_LOCATION = [
    { location: { x: 1981, y: -49, z: 8120 }, rotation: { y: 90, x: 0 } },
    { location: { x: 1952, y: -49, z: 8120 }, rotation: { y: -90, x: 0 } },
];
export function preLoadShenStage2() { }
