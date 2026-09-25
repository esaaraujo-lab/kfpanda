import { system, world } from "@minecraft/server";
import { Module, ScopedTimer, SequenceManager, delay } from "noxcrew.common.scripting/index.js";
import { seqActivityWolfBossSlam } from "../sequences.js";
import { WolfActivity } from "./wolf.js";
export class BossWolfManager extends Module {
    constructor(container, location, event, specialAttack) {
        super(container);
        this.specialAttack = specialAttack;
        this.sequenceManager = this.container.inject(SequenceManager);
        this.dimension = world.getDimension('overworld');
        this.entity = this.dimension.spawnEntity(BossWolfManager.ENTITY_ID, location);
        this.entity.triggerEvent(event);
        this.pickNextAttack();
    }
    setup() {
        this.listenFor(system.afterEvents.scriptEventReceive, e => {
            if (e.id != 'noxcrew.kp:boss_wolf_volley')
                return;
            WolfActivity.summonArrowVolley(this.dimension, e.sourceEntity?.location ?? this.entity.location);
        });
    }
    pickNextAttack() {
        this.attackNone();
        const nextAttack = Math.floor(Math.random() * 10);
        if (nextAttack < 7) {
            this.attackNormal();
        }
        else {
            switch (this.specialAttack) {
                case 'slam':
                    this.attackSlam();
                    break;
                case 'arrow':
                    this.attackArrow();
                    break;
            }
        }
    }
    getRandomTime(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    attackNormal() {
        if (!this.entity.isValid)
            return;
        this.entity.triggerEvent('noxcrew:to.attack_normal');
        const waitTime = this.getRandomTime(200, 300);
        ScopedTimer.schedule(this, waitTime, () => this.pickNextAttack());
    }
    async attackSlam() {
        if (!this.entity.isValid)
            return;
        this.entity.triggerEvent('noxcrew:to.attack_slam');
        await this.sequenceManager.runAndWait(seqActivityWolfBossSlam, this.entity);
        this.pickNextAttack();
    }
    async attackArrow() {
        if (!this.entity.isValid)
            return;
        this.entity.triggerEvent('noxcrew:to.attack_arrow');
        this.entity.runCommand('/execute as @p at @s run scriptevent noxcrew.kp:boss_wolf_volley');
        await delay(20);
        this.pickNextAttack();
    }
    attackNone() {
        if (!this.entity.isValid)
            return;
        this.entity.triggerEvent('noxcrew:to.attack_none');
    }
}
BossWolfManager.ENTITY_ID = 'noxcrew.kp:boss_wolf';
