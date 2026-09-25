import { BossFight } from "../fight.js";
import { LordShenStage2 } from "./stage_2.js";
import { LordShenStage1 } from "./stage_1.js";
import { RemoveEntityFamily } from "../../util/removeEntity.js";
export class LordShenFight extends BossFight {
    constructor() {
        super(...arguments);
        this.stages = [
            new LordShenStage1(this.container, this),
            new LordShenStage2(this.container, this),
        ];
    }
    setup() { }
    onDeactivate() {
        super.onDeactivate();
        RemoveEntityFamily(['lord_shen_fight']);
    }
}
