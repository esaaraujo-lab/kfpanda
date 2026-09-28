import { world } from "@minecraft/server";
import { EasingType } from "@minecraft/server";
import { delay } from "noxcrew.common.scripting/index.js";
import { TITLES } from "../../titles.js";
import { preLoadTaiStage1 } from "./stage_1.js";
import { seqTaiLungStage2Door } from "./stage_2_door.js";
import { RemoveEntityType } from "../../util/removeEntity.js";
import ADMIN_TAG from "../../player/disable.js";
import { stringToVector3 } from "../../util/stringToVector3.js";
import { offsetSpawn } from "../../util/offsetSpawn.js";
const quickfade = {
    fadeColor: { blue: 0.09, red: 0.109, green: 0.09 },
    fadeTime: { fadeInTime: 1, holdTime: 1, fadeOutTime: 1 },
};
const fade = {
    fadeColor: { blue: 0.09, red: 0.109, green: 0.09 },
    fadeTime: { fadeInTime: 1, holdTime: 2, fadeOutTime: 1 },
};
const endfade = {
    fadeColor: { blue: 0.09, red: 0.109, green: 0.09 },
    fadeTime: { fadeInTime: 1, holdTime: 3, fadeOutTime: 1 },
};
const NOT_ADMIN = { excludeTags: [ADMIN_TAG] };
const TAILUNG_ENTITY_CUTSCENE = 'noxcrew.kp:tai_lung_cutscene';
const stv = stringToVector3;
export function createTaiLungS1Sequence(titleManager) {
    return function* startStage1() {
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.fade(endfade);
        yield* delay(35);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.playSound('versus_screen');
        for (const player of world.getPlayers(NOT_ADMIN)) {
            titleManager.addTitle({
                ...TITLES.boss_title_tai,
                targets: new Set().add(player),
            });
        }
        preLoadTaiStage1();
        const taiLungSceneEntity = world
            .getDimension('overworld')
            .spawnEntity(TAILUNG_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
        yield* delay(200);
        taiLungSceneEntity.setProperty('noxcrew:scene', 11);
        taiLungSceneEntity.teleport({ x: 173, y: 56, z: 8046 }, { rotation: { y: -90, x: 0 } });
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.fade(quickfade);
        yield* delay(20);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.runCommand('inputpermission set @s movement disabled');
            player.runCommandAsync('gamemode spectator');
            player.teleport(stv('215 54 8053'));
            titleManager.addTitle({
                ...TITLES.boss_in_tai,
                targets: new Set().add(player),
            });
            player.camera.setCamera('noxcrew_kp:boss_tai_1_1_start');
        }
        yield* delay(20);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.camera.setCamera('noxcrew_kp:boss_tai_1_1_end', {
                easeOptions: { easeTime: 5, easeType: EasingType.InOutSine },
            });
        }
        yield* delay(160);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.runCommandAsync('inputpermission set @s movement enabled');
            player.runCommandAsync('gamemode adventure');
            player.teleport(offsetSpawn(stv('212 56 8046'), 2), { rotation: { y: 90, x: 0 } });
            titleManager.addTitle({
                ...TITLES.letterbox_out,
                targets: new Set().add(player),
            });
            player.camera.clear();
        }
    };
}
export function createTaiLungS2Sequence(titleManager, sequenceManager) {
    return function* startStage2() {
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.camera.fade(quickfade);
        }
        world.getDimension('overworld').runCommandAsync('tickingarea add circle 371 160 10109 1 tai.save.1 true');
        world.getDimension('overworld').runCommandAsync('tickingarea add circle 397 -37 10109 1 tai.save.2 true');
        yield* delay(25);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            titleManager.addTitle({
                ...TITLES.letterbox_in,
                targets: new Set().add(player),
            });
            player.runCommand('inputpermission set @s movement disabled');
            player.addEffect('invisibility', 20000000, { amplifier: 1, showParticles: false });
            player.runCommandAsync('gamemode spectator');
            player.camera.setCamera('noxcrew_kp:boss_tai_2_1_start');
            player.teleport(stv('215 56 8051'), { rotation: { y: 90, x: 0 } });
        }
        yield* delay(20);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.camera.setCamera('noxcrew_kp:boss_tai_2_1_end', {
                easeOptions: { easeTime: 3, easeType: EasingType.InOutSine },
            });
        }
        yield* delay(60);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_tai_2_2_start');
        world.getDimension('overworld').spawnParticle('noxcrew.kp:cannon_explosion', { x: 219, y: 58, z: 8046 });
        world.getDimension('overworld').runCommandAsync('camerashake add @a 0.2 1 positional');
        sequenceManager.run(seqTaiLungStage2Door);
        const taiLungSceneEntityShot2 = world
            .getDimension('overworld')
            .spawnEntity(TAILUNG_ENTITY_CUTSCENE, { x: 219, y: 56, z: 8046 });
        taiLungSceneEntityShot2.setRotation({ y: 0, x: 0 });
        taiLungSceneEntityShot2.setProperty('noxcrew:scene', 21);
        yield* delay(25);
        taiLungSceneEntityShot2.remove();
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.teleport(stv('371 160 10109'));
            player.camera.setCamera('noxcrew_kp:boss_tai_2_3_start');
        }
        yield* delay(15);
        const taiLungSceneEntityShot3 = world
            .getDimension('overworld')
            .spawnEntity(TAILUNG_ENTITY_CUTSCENE, { x: 360, y: 158, z: 10101 });
        taiLungSceneEntityShot3.setRotation({ y: 0, x: 0 });
        taiLungSceneEntityShot3.setProperty('noxcrew:scene', 22);
        yield* delay(40);
        taiLungSceneEntityShot3.remove();
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_tai_2_4_start');
        const taiLungSceneEntityShot4 = world
            .getDimension('overworld')
            .spawnEntity(TAILUNG_ENTITY_CUTSCENE, { x: 370, y: 135, z: 10103 });
        taiLungSceneEntityShot4.setRotation({ y: 0, x: 0 });
        taiLungSceneEntityShot4.setProperty('noxcrew:scene', 23);
        yield* delay(40);
        taiLungSceneEntityShot4.remove();
        const taiLungSceneEntityShot6 = world
            .getDimension('overworld')
            .spawnEntity(TAILUNG_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
        taiLungSceneEntityShot6.setRotation({ y: 0, x: 0 });
        taiLungSceneEntityShot6.setProperty('noxcrew:scene', 26);
        taiLungSceneEntityShot6.teleport({ x: 395, y: -27, z: 10110 });
        yield* delay(2);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.teleport(stv('402 -36 10130'));
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_tai_2_6_start');
        yield* delay(42);
        taiLungSceneEntityShot6.remove();
        yield* delay(1);
        const taiLungSceneEntityShot7 = world
            .getDimension('overworld')
            .spawnEntity(TAILUNG_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
        taiLungSceneEntityShot7.setRotation({ y: 0, x: 0 });
        taiLungSceneEntityShot7.setProperty('noxcrew:scene', 27);
        taiLungSceneEntityShot7.teleport({ x: 395, y: -36, z: 10110 });
        yield* delay(3);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_tai_2_7_start');
        yield* delay(20);
        world.getDimension('overworld').spawnParticle('noxcrew.kp:dust_impact', { x: 387, y: -35.6, z: 10110 });
        world.getDimension('overworld').spawnParticle('noxcrew.kp:dust_impact', { x: 403, y: -35.6, z: 10110 });
        world.getDimension('overworld').runCommandAsync('camerashake add @a 0.1 0.5 positional');
        yield* delay(100);
        taiLungSceneEntityShot7.remove();
        world.getDimension('overworld').runCommandAsync('tickingarea remove tai.save.1');
        world.getDimension('overworld').runCommandAsync('tickingarea remove tai.save.2');
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.removeEffect('invisibility');
            player.runCommandAsync('inputpermission set @s movement enabled');
            player.runCommandAsync('gamemode adventure');
            titleManager.addTitle({
                ...TITLES.letterbox_out,
                targets: new Set().add(player),
            });
            player.camera.clear();
            player.teleport(offsetSpawn(stv('398 -36 10110'), 2), { rotation: { y: 90, x: 0 } });
        }
        yield* delay(10);
    };
}
export function* TaiLungEndFight(titleManager) {
    world.getDimension('overworld').runCommandAsync('tickingarea add circle 414 -36 10109 2 tai_ending');
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(fade);
    yield* delay(30);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        titleManager.addTitle({
            ...TITLES.boss_out_tai,
            targets: new Set().add(player),
        });
        player.addEffect('invisibility', 20000000, { amplifier: 1, showParticles: false });
        player.runCommand('inputpermission set @s movement disabled');
        player.runCommandAsync('gamemode spectator');
        player.teleport(stv('402 -36 10129'), { rotation: { y: 90, x: 0 } });
    }
    const taiLungSceneEntityEnding = world
        .getDimension('overworld')
        .spawnEntity(TAILUNG_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
    taiLungSceneEntityEnding.teleport({ x: 414, y: -36, z: 10109 }, { rotation: { y: 90, x: 0 } });
    yield* delay(30);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_tai_3_1_start');
    taiLungSceneEntityEnding.setProperty('noxcrew:scene', 31);
    yield* delay(40);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_tai_3_2_start');
    taiLungSceneEntityEnding.setProperty('noxcrew:scene', 32);
    yield* delay(60);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:boss_tai_3_3_start');
        player.camera.setCamera('noxcrew_kp:boss_tai_3_4_start', {
            easeOptions: { easeTime: 6.25, easeType: EasingType.Linear },
        });
    }
    taiLungSceneEntityEnding.setProperty('noxcrew:scene', 33);
    yield* delay(70);
    taiLungSceneEntityEnding.setProperty('noxcrew:scene', 34);
    yield* delay(55);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:boss_tai_3_5_start');
        player.camera.setCamera('noxcrew_kp:boss_tai_3_5_end', {
            easeOptions: { easeTime: 2.75, easeType: EasingType.Linear },
        });
    }
    taiLungSceneEntityEnding.setProperty('noxcrew:scene', 35);
    yield* delay(55);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.teleport(stv('466 -26 10181'));
        player.camera.setCamera('noxcrew_kp:boss_tai_3_6_start');
    }
    yield* delay(20);
    world.getDimension('overworld').spawnParticle('noxcrew.kp:chi_wave', stv('414 -30 10109'));
    yield* delay(2);
    world.getDimension('overworld').spawnParticle('noxcrew.kp:chi_wave2', stv('414 -30 10109'));
    world.getDimension('overworld').spawnParticle('noxcrew.kp:chi_beams', stv('414 -30 10109'));
    world.getDimension('overworld').runCommandAsync('camerashake add @a 1.0 0.5 positional');
    yield* delay(18);
    world.getDimension('overworld').runCommandAsync('camerashake add @a 0.1 2 positional');
    yield* delay(100);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(endfade);
    yield* delay(65);
    RemoveEntityType(TAILUNG_ENTITY_CUTSCENE);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.teleport(stv('416 -36 10110'));
    world.getDimension('overworld').runCommandAsync('tickingarea remove tai_ending');
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.removeEffect('invisibility');
        player.runCommandAsync('inputpermission set @s movement enabled');
        player.runCommandAsync('gamemode adventure');
        titleManager.addTitle({
            ...TITLES.letterbox_out,
            targets: new Set().add(player),
        });
        player.camera.clear();
    }
}
