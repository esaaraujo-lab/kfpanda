import { Module } from "noxcrew.common.scripting/index.js";
export class BossFight extends Module {
    constructor() {
        super(...arguments);
        this.stageIndex = -1;
    }
    get currentStage() {
        if (!this.isActive)
            return null;
        return this.stages[this.stageIndex];
    }
    onActivate() {
        if (this.stageIndex != -1)
            throw new Error('Attempted to activate an already activated fight');
        this.nextStage();
    }
    async nextStage() {
        const currentStage = this.currentStage;
        if (currentStage != null) {
            await currentStage.onFinishStage();
            this.unregisterChild(currentStage);
        }
        const nextStage = this.stages[++this.stageIndex];
        if (nextStage != null) {
            this.registerChild(nextStage);
            await nextStage.startStage();
        }
        else {
            const gameManagerButBad = (await import('../game/GameManager')).GameManager;
            this.container.get(gameManagerButBad).endGame();
        }
    }
}
