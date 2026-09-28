import { system, world } from "@minecraft/server";
import { ScopedTimer, SequenceManager } from "noxcrew.common.scripting/index.js";
import { seqActivityCountdown } from "../sequences.js";
import { stringToVector3 } from "../util/stringToVector3.js";
import Activity from "./activity.js";
export class TrainingActivity extends Activity {
    constructor(container) {
        super(container, 'TRAINING');
        this.sequenceManager = this.container.inject(SequenceManager);
        this.score = 0;
    }
    async onActivate() {
        super.onActivate();
        await this.sequenceManager.runAndWait(seqActivityCountdown, this);
        for (const trap of this.dimension.getEntities({ families: ['training_trap'] })) {
            trap.triggerEvent('noxcrew:start');
            if (trap.typeId == 'noxcrew.kp:arrow_trap') {
                trap.triggerEvent('noxcrew:add_target_rider');
            }
        }
        this.summonDummy();
        ScopedTimer.schedule(this, TrainingActivity.TIMER - 30 * 20, () => {
            for (const player of world.getAllPlayers()) {
                player.sendMessage({ translate: 'txt.gs.msg2' });
                player.playSound('activity_timer_30', { location: player.location });
            }
        });
        ScopedTimer.schedule(this, TrainingActivity.TIMER, () => {
            this.end();
        });
    }
    onDeactivate() {
        super.onDeactivate();
        this.clean();
    }
    setup() {
        this.listenFor(system.afterEvents.scriptEventReceive, e => {
            if (e.id == 'noxcrew.kp:dummy_hit') {
                this.score++;
                ScopedTimer.schedule(this, 30, () => {
                    this.summonDummy();
                });
            }
        });
    }
    endMessage() {
        const trainingResultMsg = {
            translate: `txt.activity_training.counter`,
            with: [`${this.score}`],
        };
        world.sendMessage(trainingResultMsg);
        let tier = 'txt.activity_training.tier0';
        if (this.score >= 15) {
            tier = 'txt.activity_training.tier3';
        }
        else if (this.score >= 10) {
            tier = 'txt.activity_training.tier2';
        }
        else if (this.score >= 5) {
            tier = 'txt.activity_training.tier1';
        }
        else if (this.score != 0) {
            tier = 'txt.activity_training.tier0_1';
        }
        world.sendMessage({ rawtext: [{ translate: `${tier}` }] });
    }
    summonDummy() {
        this.dimension.spawnEntity(TrainingActivity.DUMMY_ENTITY_ID, TrainingActivity.DUMMY_POSITIONS[Math.floor(Math.random() * TrainingActivity.DUMMY_POSITIONS.length)]);
    }
    clean() {
        this.dimension.getEntities({ families: ['training_trap'] }).forEach(entity => {
            entity.triggerEvent('noxcrew:stop');
        });
        this.dimension.getEntities({ families: ['target_dummies'] }).forEach(entity => {
            entity.triggerEvent('noxcrew:despawn');
        });
    }
}
TrainingActivity.TIMER = 90 * 20;
TrainingActivity.DUMMY_ENTITY_ID = 'noxcrew.kp:target_dummies';
TrainingActivity.DUMMY_POSITIONS = stringToVector3([
    '508.0 -5 6022.0',
    '516.0 -5 6018.0',
    '522.0 -5 6018.0',
    '530.0 -5 6022.0',
    '528.0 -5 6030.0',
    '522.0 -5 6030.0',
    '516.0 -5 6030.0',
    '510.0 -5 6030.0',
    '510.0 -5 6038.0',
    '516.0 -5 6038.0',
    '522.0 -5 6038.0',
    '528.0 -5 6038.0',
    '528.0 -5 6046.0',
    '522.0 -5 6046.0',
    '516.0 -5 6046.0',
    '510.0 -5 6046.0',
    '510.0 -5 6054.0',
    '515.0 -5 6058.0',
    '523.0 -5 6058.0',
    '528.0 -5 6054.0',
]);
