import { system, world } from "@minecraft/server";
import { BossFightStage } from "../stage.js";
import { ScopedTimer, TitleManagerV2, property } from "noxcrew.common.scripting/index.js";
import { RemoveEntityFamily } from "../../util/removeEntity.js";
import { createChameleonS2Sequence } from "./cutscenes.js";
import { ChameleonFight } from "./fight.js";
import { stringToVector3 } from "../../util/stringToVector3.js";
import { Vector3Utils } from "../../util/math/vectorUtils.js";
import { timeout } from "../../util/timer.js";
export function preLoadChameleonStage2() {
    RemoveEntityFamily(['chameleon_fight']);
}
export class ChameleonStage2 extends BossFightStage {
    constructor() {
        super(...arguments);
        this.dimension = world.getDimension('overworld');
        this.titleManager = this.container.inject(TitleManagerV2);
        this.animation = property('noxcrew:attack');
        this.startSequence = createChameleonS2Sequence(this.titleManager);
        this.fightLocation = 'chameleon_2';
        this.fireballs = 0;
        this.rubble = 0;
        this.tempArray = [];
        this.lastAttack = '';
        this.TARGET_LOCS = stringToVector3([
            '6194 24 4040',
            '6202 24 4041',
            '6210 24 4041',
            '6180 24 4046',
            '6187 24 4045',
            '6195 24 4047',
            '6202 24 4048',
            '6212 24 4047',
            '6219 24 4049',
            '6177 24 4053',
            '6185 24 4052',
            '6190 24 4052',
            '6198 24 4054',
            '6208 24 4053',
            '6215 24 4057',
            '6222 24 4056',
            '6178 24 4060',
            '6185 24 4062',
            '6192 24 4059',
            '6201 24 4061',
            '6208 24 4060',
            '6173 24 4067',
            '6180 24 4068',
            '6190 24 4068',
            '6197 24 4066',
            '6207 24 4067',
            '6214 24 4066',
            '6223 24 4065',
            '6174 24 4074',
            '6181 24 4075',
            '6188 24 4074',
            '6195 24 4076',
            '6202 24 4075',
            '6209 24 4073',
            '6216 24 4073',
            '6224 24 4073',
            '6178 24 4081',
            '6186 24 4081',
            '6193 24 4084',
            '6200 24 4082',
            '6207 24 4080',
            '6214 24 4080',
            '6221 24 4080',
            '6218 24 4087',
            '6211 24 4087',
            '6204 24 4089',
            '6197 24 4091',
            '6191 24 4090',
            '6183 24 4088',
            '6172 24 4060',
        ]);
    }
    resetStage() {
        RemoveEntityFamily(['chameleon_fight']);
    }
    setupStage() {
        this.dimension.runCommand('clear @a noxcrew.kp:rubble_throwable');
        world.getDimension('overworld').runCommandAsync(`function music/BOSS_CHAMELEON_2`);
        const dragon = this.dimension.spawnEntity(ChameleonFight.CHAMELEON_DRAGON_ENTITY, stringToVector3('0 0 0'));
        dragon.teleport(stringToVector3('6198 37 4066'));
        dragon.triggerEvent('noxcrew:add.boss_fight');
        this.attackCooldown(100);
        this.titleManager.addTitle({
            type: 'one-off',
            duration: 60,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.boss_cham.ab2` }] } },
        });
        world.sendMessage({ translate: 'txt.boss_cham.context2' });
    }
    setup() {
        this.listenFor(system.afterEvents.scriptEventReceive, e => {
            const id = e.id.split('.')[0];
            const event = e.id.split('.')[1];
            if (id != 'noxcrew:attack')
                return;
            switch (event) {
                case 'fireball_shoot':
                    this.fireballShoot();
                    break;
                case 'rock_fall':
                    this.fireballShoot();
                    break;
            }
        });
        this.listenFor(world.afterEvents.entityHealthChanged, e => {
            const entity = e.entity;
            if (entity.typeId !== ChameleonFight.CHAMELEON_DRAGON_ENTITY)
                return;
            const currentHealth = e.newValue;
            if (currentHealth <= 5) {
                this.finishStage();
            }
        });
    }
    attackCooldown(cooldown) {
        ScopedTimer.schedule(this, cooldown, () => {
            if (this.lastAttack.length != 0) {
                this.lastAttack === 'rubble_fall' ? this.fireballShoot() : this.rubbleFall();
            }
            else
                this.fireballShoot();
        });
    }
    async fireballShoot() {
        const dragon = this.dimension.getEntities({
            type: ChameleonFight.CHAMELEON_DRAGON_ENTITY,
            closest: 1,
        })[0];
        dragon.setProperty(this.animation, 'fire');
        await timeout(30);
        this.lastAttack = 'fireball_shoot';
        this.tempArray = [...this.TARGET_LOCS];
        ScopedTimer.schedule(this, 10, cancel => {
            const startPoint = stringToVector3('6198 60 4066');
            const d = Math.floor(Math.random() * this.tempArray.length);
            const endPoint = this.tempArray[d];
            const index = this.tempArray.indexOf(this.tempArray[d]);
            if (index > -1) {
                this.tempArray.splice(index, 1);
            }
            const direction = Vector3Utils.subtract(endPoint, startPoint);
            const throwPower = Vector3Utils.scale(direction, 0.1);
            world.getDimension('overworld').spawnEntity('noxcrew.kp:dragon_fireball', startPoint).applyImpulse(throwPower);
            if (++this.fireballs > 20) {
                this.fireballs = 0;
                this.tempArray = [];
                this.attackCooldown(200);
                dragon.setProperty(this.animation, 'none');
                cancel();
            }
        }, true);
    }
    async rubbleFall() {
        const dragon = this.dimension.getEntities({
            type: ChameleonFight.CHAMELEON_DRAGON_ENTITY,
            closest: 1,
        })[0];
        dragon.setProperty(this.animation, 'roar');
        await timeout(30);
        world.getDimension('overworld').runCommandAsync('camerashake add @a 0.5 3 positional');
        this.lastAttack = 'rubble_fall';
        this.tempArray = [...this.TARGET_LOCS];
        ScopedTimer.schedule(this, 20, cancel => {
            const dropheight = stringToVector3('0 35 0');
            const d = Math.floor(Math.random() * this.tempArray.length);
            const endPoint = this.tempArray[d];
            const index = this.tempArray.indexOf(this.tempArray[d]);
            if (index > -1) {
                this.tempArray.splice(index, 1);
            }
            const spawnLoc = Vector3Utils.add(endPoint, dropheight);
            world.getDimension('overworld').spawnEntity('noxcrew.kp:chameleon_rubble', spawnLoc);
            world.getDimension('overworld').spawnEntity('noxcrew.kp:chameleon_rubble_shadow', endPoint);
            if (++this.rubble > 10) {
                this.rubble = 0;
                this.tempArray = [];
                this.attackCooldown(200);
                dragon.setProperty(this.animation, 'none');
                cancel();
            }
        }, true);
    }
}
