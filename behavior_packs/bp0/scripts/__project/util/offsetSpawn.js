export function offsetSpawn(pos, rad) {
    return {
        x: Math.floor(pos.x) - rad + Math.floor(Math.random() * (rad * 2 + 1)) + 0.5,
        y: pos.y,
        z: Math.floor(pos.z) - rad + Math.floor(Math.random() * (rad * 2 + 1)) + 0.5,
    };
}
