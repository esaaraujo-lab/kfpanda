import { world } from "@minecraft/server";
import { EasingType } from "@minecraft/server";
import { delay } from "noxcrew.common.scripting/index.js";
import { TITLES } from "../../titles.js";
import { preLoadChameleonStage1 } from "./stage_1.js";
import { RemoveEntityType } from "../../util/removeEntity.js";
import ADMIN_TAG from "../../player/disable.js";
import { stringToVector3 } from "../../util/stringToVector3.js";
import { preLoadChameleonStage2 } from "./stage_2.js";
import { preLoadChameleonStage3 } from "./stage_3.js";
import { offsetSpawn } from "../../util/offsetSpawn.js";
const quickfade = {
    fadeColor: { blue: 0.09, red: 0.109, green: 0.09 },
    fadeTime: { fadeInTime: 1, holdTime: 1, fadeOutTime: 1 },
};
const fade = {
    fadeColor: { blue: 0.09, red: 0.109, green: 0.09 },
    fadeTime: { fadeInTime: 1, holdTime: 4, fadeOutTime: 1 },
};
const endfade = {
    fadeColor: { blue: 0.09, red: 0.109, green: 0.09 },
    fadeTime: { fadeInTime: 1, holdTime: 3, fadeOutTime: 1 },
};
const NOT_ADMIN = { excludeTags: [ADMIN_TAG] };
const CHAMELEON_ENTITY_CUTSCENE = 'noxcrew.kp:chameleon_cutscene';
export function createChameleonS1Sequence(titleManager) {
    return function* startStage1() {
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.fade(fade);
        yield* delay(20);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.playSound('versus_screen');
        for (const player of world.getPlayers(NOT_ADMIN)) {
            titleManager.addTitle({
                ...TITLES.boss_title_chameleon,
                targets: new Set().add(player),
            });
        }
        yield* delay(180);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.teleport(stringToVector3('6189 24 4030'));
            player.addEffect('invisibility', 20000000, { amplifier: 1, showParticles: false });
            player.runCommand('inputpermission set @s movement disabled');
            player.runCommandAsync('gamemode spectator');
        }
        world.setTimeOfDay(13000);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.teleport(stringToVector3('6198 24 4051'));
        yield* delay(10);
        preLoadChameleonStage1();
        yield* delay(10);
        const chameleonOpening = world
            .getDimension('overworld')
            .spawnEntity(CHAMELEON_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
        chameleonOpening.teleport(stringToVector3('6198.5 24 4066.5'), { rotation: { y: 180, x: 0 } });
        chameleonOpening.setProperty('noxcrew:scene', 11);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            titleManager.addTitle({
                type: 'one-off',
                duration: 0,
                weight: 0,
                components: { title: { rawtext: [{ translate: `nox:boss_in_chameleon` }] } },
            });
            player.camera.setCamera('noxcrew_kp:boss_cham_1_1_start');
            player.camera.setCamera('noxcrew_kp:boss_cham_1_1_end', {
                easeOptions: { easeTime: 16, easeType: EasingType.InOutSine },
            });
        }
        yield* delay(320);
        chameleonOpening.setProperty('noxcrew:scene', 12);
        yield* delay(80);
        chameleonOpening.remove();
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.runCommandAsync('inputpermission set @s movement enabled');
            player.removeEffect('invisibility');
            player.runCommandAsync('gamemode adventure');
            player.teleport(offsetSpawn(stringToVector3('6198 24 4051'), 2), { rotation: { y: 0, x: 0 } });
            titleManager.addTitle({
                type: 'one-off',
                duration: 0,
                weight: 0,
                components: { title: { rawtext: [{ translate: `nox:letterbox_out` }] } },
            });
            player.camera.clear();
        }
    };
}
export function createChameleonS2Sequence(titleManager) {
    return function* startStage2() {
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.camera.fade(quickfade);
        }
        yield* delay(40);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.teleport(stringToVector3('6198 24 4031'));
            player.addEffect('invisibility', 20000000, { amplifier: 1, showParticles: false });
            player.runCommand('inputpermission set @s movement disabled');
            player.runCommandAsync('gamemode spectator');
        }
        preLoadChameleonStage2();
        const chameleonTrans1 = world.getDimension('overworld').spawnEntity(CHAMELEON_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
        chameleonTrans1.teleport(stringToVector3('6198.5 24 4066.5'), { rotation: { y: 90, x: 0 } });
        chameleonTrans1.setProperty('noxcrew:scene', 21);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            titleManager.addTitle({
                ...TITLES.letterbox_in,
                targets: new Set().add(player),
            });
            player.camera.setCamera('noxcrew_kp:boss_cham_2_1_start');
            player.camera.setCamera('noxcrew_kp:boss_cham_2_1_end', {
                easeOptions: { easeTime: 7, easeType: EasingType.InOutSine },
            });
        }
        yield* delay(140);
        const chameleonPo = world.getDimension('overworld').spawnEntity(CHAMELEON_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
        chameleonPo.teleport(stringToVector3('6182.5 24 4066.5'), { rotation: { y: -90, x: 0 } });
        chameleonPo.setProperty('noxcrew:scene', 22);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_cham_2_2_start');
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_cham_2_2_end', {
                easeOptions: { easeTime: 10, easeType: EasingType.InSine },
            });
        yield* delay(199);
        chameleonTrans1.setProperty('noxcrew:scene', 23);
        yield* delay(1);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_cham_2_3_start');
        yield* delay(50);
        world.getDimension('overworld').runCommandAsync('camerashake add @a 0.2 4.5 positional');
        chameleonPo.remove();
        yield* delay(90);
        chameleonTrans1.setProperty('noxcrew:scene', 24);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_cham_2_4_start');
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_cham_2_4_end', {
                easeOptions: { easeTime: 4, easeType: EasingType.OutSine },
            });
        world.getDimension('overworld').runCommandAsync('camerashake add @a 0.2 3 positional');
        yield* delay(60);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.fade(quickfade);
        yield* delay(20);
        chameleonTrans1.remove();
        RemoveEntityType(CHAMELEON_ENTITY_CUTSCENE);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.removeEffect('invisibility');
            player.runCommandAsync('inputpermission set @s movement enabled');
            player.runCommandAsync('gamemode adventure');
            titleManager.addTitle({
                ...TITLES.letterbox_out,
                targets: new Set().add(player),
            });
            player.camera.clear();
            player.teleport(stringToVector3('6198 24 4051'), { rotation: { y: 0, x: 0 } });
        }
        yield* delay(20);
    };
}
export function createChameleonS3Sequence(titleManager) {
    return function* startStage3() {
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.camera.fade(fade);
        }
        yield* delay(20);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.teleport(stringToVector3('6198 24 4031'));
            player.addEffect('invisibility', 20000000, { amplifier: 1, showParticles: false });
            player.runCommand('inputpermission set @s movement disabled');
            player.runCommandAsync('gamemode spectator');
        }
        preLoadChameleonStage3();
        yield* delay(20);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            titleManager.addTitle({
                ...TITLES.letterbox_in,
                targets: new Set().add(player),
            });
        }
        const chameleonTrans2 = world.getDimension('overworld').spawnEntity(CHAMELEON_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
        chameleonTrans2.teleport(stringToVector3('6198 24 4066'), { rotation: { y: 180, x: 0 } });
        chameleonTrans2.setProperty('noxcrew:scene', 31);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_cham_3_1_start');
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_cham_3_1_end', {
                easeOptions: { easeTime: 4, easeType: EasingType.Linear },
            });
        yield* delay(80);
        chameleonTrans2.setProperty('noxcrew:scene', 32);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_cham_3_2_start');
        yield* delay(10);
        world.getDimension('overworld').runCommandAsync('camerashake add @a 0.2 1 positional');
        world.getDimension('overworld').spawnParticle('noxcrew.kp:dust_cloud_dense', stringToVector3('6198 23 4066'));
        world.getDimension('overworld').spawnParticle('noxcrew.kp:dust_cloud_light', stringToVector3('6198 24 4066'));
        yield* delay(40);
        chameleonTrans2.setProperty('noxcrew:scene', 33);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_cham_3_3_start');
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_cham_3_3_end', {
                easeOptions: { easeTime: 10, easeType: EasingType.Linear },
            });
        yield* delay(100);
        chameleonTrans2.setProperty('noxcrew:scene', 34);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_cham_3_4_start');
        yield* delay(40);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_cham_3_4_end', {
                easeOptions: { easeTime: 6, easeType: EasingType.InSine },
            });
        yield* delay(180);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.camera.fade(quickfade);
        }
        yield* delay(20);
        chameleonTrans2.remove();
        RemoveEntityType(CHAMELEON_ENTITY_CUTSCENE);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.removeEffect('invisibility');
            player.runCommandAsync('inputpermission set @s movement enabled');
            player.runCommandAsync('gamemode adventure');
            titleManager.addTitle({
                ...TITLES.letterbox_out,
                targets: new Set().add(player),
            });
            player.camera.clear();
            player.teleport(offsetSpawn(stringToVector3('6201 70 5021'), 2), { rotation: { y: 0, x: 0 } });
        }
        yield* delay(20);
    };
}
export function* ChameleonEndFight(titleManager) {
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(fade);
    yield* delay(30);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.teleport({ x: 6218, y: 90, z: 5019 }, { rotation: { y: 0, x: 0 } });
        titleManager.addTitle({
            ...TITLES.boss_out_chameleon,
            targets: new Set().add(player),
        });
    }
    const chameleonEnding = world.getDimension('overworld').spawnEntity(CHAMELEON_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
    chameleonEnding.teleport(stringToVector3('6201.5 70 5062.5'), { rotation: { y: 180, x: 0 } });
    chameleonEnding.setProperty('noxcrew:scene', 41);
    yield* delay(30);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_cham_4_1_start');
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_cham_4_1_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.Linear },
        });
    yield* delay(200);
    chameleonEnding.setProperty('noxcrew:scene', 42);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_cham_4_2_start');
    yield* delay(60);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_cham_4_2_end', {
            easeOptions: { easeTime: 4, easeType: EasingType.InSine },
        });
    yield* delay(100);
    chameleonEnding.setProperty('noxcrew:scene', 43);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_cham_4_3_start');
    yield* delay(40);
    chameleonEnding.setProperty('noxcrew:scene', 44);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_cham_4_4_start');
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_cham_4_4_end', {
            easeOptions: { easeTime: 4, easeType: EasingType.Linear },
        });
    yield* delay(80);
    chameleonEnding.setProperty('noxcrew:scene', 45);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_cham_4_5_start');
    yield* delay(30);
    chameleonEnding.setProperty('noxcrew:scene', 46);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_cham_4_6_start');
    yield* delay(30);
    chameleonEnding.setProperty('noxcrew:scene', 47);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_cham_4_7_start');
    yield* delay(40);
    chameleonEnding.setProperty('noxcrew:scene', 48);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_cham_4_8_start');
    world.getDimension('overworld').runCommandAsync('camerashake add @a 0.2 3 positional');
    yield* delay(135);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(endfade);
    yield* delay(25);
    chameleonEnding.remove();
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.teleport({ x: 6225, y: 120, z: 255 });
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
