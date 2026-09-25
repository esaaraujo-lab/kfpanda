export function isInBounds(location, first, second) {
    return first.x <= location.x && location.x <= second.x &&
        first.y <= location.y && location.y <= second.y &&
        first.z <= location.z && location.z <= second.z;
}
