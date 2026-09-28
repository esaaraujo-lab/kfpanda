import { world } from "@minecraft/server";
import { TickingModule } from "noxcrew.common.scripting/index.js";
export class TreeSling extends TickingModule {
    constructor(container) {
        super(container, 1);
    }
    tick() {
        for (const player of world.getAllPlayers()) {
            const slings = TreeSling.dimension.getEntities({
                type: TreeSling.SLING_ENTITY_ID,
                location: player.location,
                closest: 1,
                maxDistance: 2,
            });
            const distanceCheck = slings.length > 0;
            if (player.hasTag('tree_sling')) {
                if (!distanceCheck) {
                    player.removeTag('tree_sling');
                }
            }
            else {
                if (distanceCheck) {
                    player.addTag('tree_sling');
                    slings[0].triggerEvent('noxcrew:set.launch.true');
                    const rot = (player.getRotation().y + 90) * (Math.PI / 180);
                    const moveX = Math.cos(rot);
                    const moveZ = Math.sin(rot);
                    player.applyKnockback(moveX, moveZ, 2, 1.3);
                }
            }
        }
    }
}
TreeSling.SLING_ENTITY_ID = 'noxcrew.kp:tree_sling';
TreeSling.dimension = world.getDimension('overworld');
