import { world } from "@minecraft/server";
import { BossFightStage } from "../stage.js";
import { TitleManagerV2 } from "noxcrew.common.scripting/index.js";
import { RemoveEntityFamily } from "../../util/removeEntity.js";
import { ChameleonEndFight, createChameleonS3Sequence } from "./cutscenes.js";
import { ChameleonFight } from "./fight.js";
import { stringToVector3 } from "../../util/stringToVector3.js";
export function preLoadChameleonStage3() {
    RemoveEntityFamily(['chameleon_fight']);
}
export class ChameleonStage3 extends BossFightStage {
    constructor() {
        super(...arguments);
        this.dimension = world.getDimension('overworld');
        this.titleManager = this.container.inject(TitleManagerV2);
        this.startSequence = createChameleonS3Sequence(this.titleManager);
        this.fightLocation = 'chameleon_3';
    }
    resetStage() {
        RemoveEntityFamily(['chameleon_fight']);
    }
    setupStage() {
        this.dimension.runCommand('clear @a noxcrew.kp:rubble_throwable');
        for (const rubble of ChameleonStage3.RUBBLE_LOCS) {
            let rubbleEntity = world
                .getDimension('overworld')
                .spawnEntity(ChameleonStage3.RUBBLE_ENTITY, { x: 0, y: 0, z: 0 });
            rubbleEntity.teleport(rubble.location, { rotation: rubble.rotation });
        }
        world.getDimension('overworld').runCommandAsync(`function music/BOSS_CHAMELEON_2`);
        const chameleon = world
            .getDimension('overworld')
            .spawnEntity(ChameleonFight.CHAMELEON_PO_ENTITY, stringToVector3('0 0 0'));
        chameleon.triggerEvent('noxcrew:attack.random');
        chameleon.teleport(stringToVector3('6201 70 5056'));
        this.titleManager.addTitle({
            type: 'one-off',
            duration: 60,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.boss_cham.ab3` }] } },
        });
        world.sendMessage({ translate: 'txt.boss_cham.context3' });
        for (const player of world.getAllPlayers())
            player.playSound('po_finish_this', { location: player.location, volume: 5 });
    }
    setup() {
        this.listenFor(world.afterEvents.entityDie, e => {
            const deadBoss = e.deadEntity.typeId;
            if (deadBoss !== ChameleonFight.CHAMELEON_PO_ENTITY)
                return;
            this.dimension.runCommand('clear @a noxcrew.kp:rubble_throwable');
            this.finishStage();
        });
    }
    async onFinishStage() {
        await this.sequenceManager.runAndWait(ChameleonEndFight, this.titleManager);
    }
}
ChameleonStage3.RUBBLE_LOCS = [
    { location: stringToVector3('6208 70 5074'), rotation: { y: 180, x: 0 } },
    { location: stringToVector3('6181 70 5056'), rotation: { y: 90, x: 0 } },
    { location: stringToVector3('6213 70 5037'), rotation: { y: 0, x: 0 } },
];
ChameleonStage3.RUBBLE_ENTITY = 'noxcrew.kp:chameleon_rubble';
