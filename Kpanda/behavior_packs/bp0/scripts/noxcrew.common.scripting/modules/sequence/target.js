import { Player } from "@minecraft/server";
/**
 * Creates a {@link SequenceTarget} from a {@link SequenceTargetable}.
 * @param target the targetable object
 * @throws Error if {@link target} is not targetable
 */
export function createTarget(target) {
    if (target instanceof Player) {
        return {
            type: "player",
            id: target.id
        };
    }
    throw new Error(`${target} is not a valid sequence target`);
}
//# sourceMappingURL=target.js.map