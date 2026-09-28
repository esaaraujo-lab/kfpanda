import { pythag3 } from "./math.js";
export function isWithinBlockMask(block, height) {
    return entity => entity.dimension.getBlock({ ...entity.location, y: height })?.permutation.matches(block) == true;
}
export function isWithinRectBounds(bounds) {
    const xMax = Math.max(bounds.x1, bounds.x2);
    const yMax = Math.max(bounds.y1, bounds.y2);
    const zMax = Math.max(bounds.z1, bounds.z2);
    const xMin = Math.min(bounds.x1, bounds.x2);
    const yMin = Math.min(bounds.y1, bounds.y2);
    const zMin = Math.min(bounds.z1, bounds.z2);
    return entity => entity.location.x >= xMin &&
        entity.location.y >= yMin &&
        entity.location.z >= zMin &&
        Math.floor(entity.location.x) <= xMax &&
        Math.floor(entity.location.y) <= yMax &&
        Math.floor(entity.location.z) <= zMax;
}
export function isWithinRadius(location, radius) {
    return entity => pythag3(location.x - entity.location.x, location.y - entity.location.y, location.z - entity.location.z) < radius;
}
//# sourceMappingURL=locationCheck.js.map