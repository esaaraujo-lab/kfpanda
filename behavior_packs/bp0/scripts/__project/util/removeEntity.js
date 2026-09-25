import { world } from "@minecraft/server";
export function RemoveEntityType(entityType) {
    let removeEntites = world.getDimension('overworld').getEntities({
        type: entityType,
    });
    for (const entity of removeEntites) {
        entity.triggerEvent('noxcrew:despawn');
    }
}
export function RemoveEntityFamily(families) {
    let removeEntites = world.getDimension('overworld').getEntities({
        families: families,
    });
    for (const entity of removeEntites) {
        entity.triggerEvent('noxcrew:despawn');
    }
}
