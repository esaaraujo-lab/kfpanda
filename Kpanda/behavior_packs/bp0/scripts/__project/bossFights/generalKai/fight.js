import { BossFight } from "../fight.js";
import { GeneralKaiStage2 } from "./stage_2.js";
import { GeneralKaiStage1 } from "./stage_1.js";
import { RemoveEntityFamily } from "../../util/removeEntity.js";
export class GeneralKaiFight extends BossFight {
    constructor() {
        super(...arguments);
        this.stages = [
            new GeneralKaiStage1(this.container, this),
            new GeneralKaiStage2(this.container, this),
        ];
    }
    setup() { }
    onDeactivate() {
        super.onDeactivate();
        RemoveEntityFamily(['kai_fight']);
    }
}
GeneralKaiFight.KAI_ENTITY = 'noxcrew.kp:general_kai';
