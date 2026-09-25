import { world } from "@minecraft/server";
import { throwErr } from "../../api/index.js";
/**
 * The object key for stage conditions.
 * @see runStageIf
 */
const STAGE_CONDITION = Symbol();
/**
 * Sets a condition for a stage.
 *
 * {@link condition} will be invoked before starting the stage,
 * if it returns false then the stage will be skipped.
 *
 * This method only applies to stages in a multi-stage sequence -
 * it has no effect for single-stage sequences.
 *
 * This method mutates {@link sequence} and is not pure.
 *
 * @param sequence the sequence to set a condition for
 * @param condition the condition to set
 */
export function runStageIf(sequence, condition) {
    sequence[STAGE_CONDITION] = condition;
    return sequence;
}
/**
 * Creates a new multi-stage sequence.
 * Should the sequence be cancelled, it will be replayed from the stage that the sequence reached.
 * @param id the sequence's identifier, used to track sequence progress in a property
 * @param stages the sequence's stages
 */
export function multistage(id, ...stages) {
    const scoreboard = world.scoreboard.getObjective(id) ?? throwErr('No scoreboard found!');
    // Create a generator function that iterates over each stage.
    const generator = function* (...args) {
        const player = args[0];
        for (let stage = scoreboard.getScore(player) ?? 0; stage < stages.length; stage++) {
            // Set the property.
            scoreboard.setScore(player, stage);
            // If the stage has a condition, check it before executing.
            if (stage[STAGE_CONDITION]?.(...args) === false)
                continue;
            // Do the thing!
            yield* stages[stage](...args);
        }
        // We've completed every stage, so reset the property.
        scoreboard.removeParticipant(player);
    };
    // Add the reset function.
    generator.resetFor = function (player) {
        scoreboard.removeParticipant(player);
    };
    return generator;
}
//# sourceMappingURL=multistage.js.map