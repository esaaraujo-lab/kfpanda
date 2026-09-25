import { clampNumber } from "./clamp.js";
export class Vector3Utils {
    static equals(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
    }
    static add(v1, v2) {
        return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z };
    }
    static subtract(v1, v2) {
        return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z };
    }
    static scale(v1, scale) {
        return { x: v1.x * scale, y: v1.y * scale, z: v1.z * scale };
    }
    static dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }
    static cross(a, b) {
        return {
            x: a.y * b.z - a.z * b.y,
            y: a.z * b.x - a.x * b.z,
            z: a.x * b.y - a.y * b.x,
        };
    }
    static magnitude(v) {
        return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
    }
    static normalize(v) {
        const mag = Vector3Utils.magnitude(v);
        return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
    }
    static floor(v) {
        return { x: Math.floor(v.x), y: Math.floor(v.y), z: Math.floor(v.z) };
    }
    static toString(v, options) {
        const decimals = options?.decimals ?? 2;
        const str = [v.x.toFixed(decimals), v.y.toFixed(decimals), v.z.toFixed(decimals)];
        return str.join(options?.delimiter ?? ', ');
    }
    static clamp(v, limits) {
        return {
            x: clampNumber(v.x, limits?.min?.x ?? Number.MIN_SAFE_INTEGER, limits?.max?.x ?? Number.MAX_SAFE_INTEGER),
            y: clampNumber(v.y, limits?.min?.y ?? Number.MIN_SAFE_INTEGER, limits?.max?.y ?? Number.MAX_SAFE_INTEGER),
            z: clampNumber(v.z, limits?.min?.z ?? Number.MIN_SAFE_INTEGER, limits?.max?.z ?? Number.MAX_SAFE_INTEGER),
        };
    }
}
export class Vector2Utils {
    static toString(v, options) {
        const decimals = options?.decimals ?? 2;
        const str = [v.x.toFixed(decimals), v.y.toFixed(decimals)];
        return str.join(options?.delimiter ?? ', ');
    }
}
export const VECTOR3_UP = { x: 0, y: 1, z: 0 };
export const VECTOR3_DOWN = { x: 0, y: -1, z: 0 };
export const VECTOR3_LEFT = { x: -1, y: 0, z: 0 };
export const VECTOR3_RIGHT = { x: 1, y: 0, z: 0 };
export const VECTOR3_FORWARD = { x: 0, y: 0, z: 1 };
export const VECTOR3_BACK = { x: 0, y: 0, z: -1 };
export const VECTOR3_ONE = { x: 1, y: 1, z: 1 };
export const VECTOR3_ZERO = { x: 0, y: 0, z: 0 };
export const VECTOR3_WEST = { x: -1, y: 0, z: 0 };
export const VECTOR3_EAST = { x: 1, y: 0, z: 0 };
export const VECTOR3_NORTH = { x: 0, y: 0, z: 1 };
export const VECTOR3_SOUTH = { x: 0, y: 0, z: -1 };
