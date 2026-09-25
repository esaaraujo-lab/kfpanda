import { world } from "@minecraft/server";
import { EasingType } from "@minecraft/server";
import { delay } from "noxcrew.common.scripting/index.js";
import ADMIN_TAG from "../../player/disable.js";
import { TITLES } from "../../titles.js";
import { preLoadKaiStage1 } from "./stage_1.js";
import { stringToVector3 } from "../../util/stringToVector3.js";
import { offsetSpawn } from "../../util/offsetSpawn.js";
const quickfade = {
    fadeColor: { blue: 0.09, red: 0.109, green: 0.09 },
    fadeTime: { fadeInTime: 1, holdTime: 2, fadeOutTime: 1 },
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
const KAI_ENTITY_CUTSCENE = 'noxcrew.kp:general_kai_cutscene';
const stv = stringToVector3;
export function CreateGeneralKaiS1Sequence(titleManager) {
    return function* startStage1() {
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.fade(endfade);
        yield* delay(35);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.playSound('versus_screen');
        for (const player of world.getPlayers(NOT_ADMIN)) {
            titleManager.addTitle({
                ...TITLES.boss_title_kai,
                targets: new Set().add(player),
            });
        }
        yield* delay(50);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.teleport(stv('4105 131 6132'));
            player.addEffect('invisibility', 20000000, { amplifier: 1, showParticles: false });
            player.runCommand('inputpermission set @s movement disabled');
            player.runCommandAsync('gamemode spectator');
        }
        preLoadKaiStage1();
        yield* delay(150);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            titleManager.addTitle({
                ...TITLES.boss_in_kai,
                targets: new Set().add(player),
            });
            player.camera.setCamera('noxcrew_kp:boss_kai_1_1_start');
            player.camera.setCamera('noxcrew_kp:boss_kai_1_1_end', {
                easeOptions: { easeTime: 8, easeType: EasingType.InSine },
            });
        }
        yield* delay(160);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_kai_1_2_start');
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.camera.setCamera('noxcrew_kp:boss_kai_1_3_start', {
                easeOptions: { easeTime: 4, easeType: EasingType.InOutSine },
            });
        }
        yield* delay(60);
        const kaiSceneStart = world.getDimension('overworld').spawnEntity(KAI_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
        kaiSceneStart.teleport(stringToVector3('4081 140 6100'), { rotation: { y: -90, x: 0 } });
        kaiSceneStart.setProperty('noxcrew:scene', 15);
        yield* delay(100);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            titleManager.addTitle({
                ...TITLES.letterbox_out,
                targets: new Set().add(player),
            });
            player.teleport(offsetSpawn(stv('4126 133 6123'), 2), { rotation: { y: 120, x: 0 } });
            player.removeEffect('invisibility');
            player.runCommandAsync('inputpermission set @s movement enabled');
            player.runCommandAsync('gamemode adventure');
            player.camera.clear();
        }
        kaiSceneStart.remove();
    };
}
export function CreateGeneralKaiS2Sequence(titleManager) {
    return function* startStage2() {
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.fade(quickfade);
        yield* delay(30);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.teleport(stv('4105 131 6132'));
            player.addEffect('invisibility', 20000000, { amplifier: 1, showParticles: false });
            player.runCommand('inputpermission set @s movement disabled');
            player.runCommandAsync('gamemode spectator');
        }
        yield* delay(20);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            titleManager.addTitle({
                ...TITLES.letterbox_in,
                targets: new Set().add(player),
            });
            player.camera.setCamera('noxcrew_kp:boss_kai_2_1_start');
        }
        const kaiSceneTrans = world.getDimension('overworld').spawnEntity(KAI_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
        kaiSceneTrans.teleport(stringToVector3('4083 127 6101'), { rotation: { y: -90, x: 0 } });
        kaiSceneTrans.setProperty('noxcrew:scene', 21);
        yield* delay(80);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_kai_2_2_start');
        kaiSceneTrans.setProperty('noxcrew:scene', 22);
        yield* delay(100);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_kai_2_3_start');
        kaiSceneTrans.setProperty('noxcrew:scene', 23);
        yield* delay(100);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_kai_2_4_start');
        kaiSceneTrans.setProperty('noxcrew:scene', 24);
        yield* delay(40);
        kaiSceneTrans.setProperty('noxcrew:scene', 25);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.camera.setCamera('noxcrew_kp:boss_kai_2_4_end', {
                easeOptions: { easeTime: 5, easeType: EasingType.InOutSine },
            });
        }
        yield* delay(80);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            titleManager.addTitle({
                ...TITLES.area_in_spirit_realm,
                targets: new Set().add(player),
            });
        }
        yield* delay(20);
        kaiSceneTrans.remove();
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.teleport(stv('4072 48 8013'), { rotation: { y: 180, x: 0 } });
            player.removeEffect('invisibility');
            player.runCommandAsync('inputpermission set @s movement enabled');
            player.runCommandAsync('gamemode adventure');
            player.camera.clear();
        }
        yield* delay(20);
    };
}
export function* GeneralKaiEndFight(titleManager) {
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(30);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.teleport(stv('4044 58 7991'));
        player.addEffect('invisibility', 20000000, { amplifier: 1, showParticles: false });
        player.runCommand('inputpermission set @s movement disabled');
        player.runCommandAsync('gamemode spectator');
    }
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        titleManager.addTitle({
            ...TITLES.boss_out_kai,
            targets: new Set().add(player),
        });
        player.camera.setCamera('noxcrew_kp:boss_kai_3_1_start');
        player.camera.setCamera('noxcrew_kp:boss_kai_3_1_end', {
            easeOptions: { easeTime: 5, easeType: EasingType.Linear },
        });
    }
    const kaiSceneFinal = world.getDimension('overworld').spawnEntity(KAI_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
    kaiSceneFinal.teleport(stv('4072.5 42 7976.5'), { rotation: { y: 0, x: 0 } });
    kaiSceneFinal.setProperty('noxcrew:scene', 31);
    const kaiSceneFinalPo = world.getDimension('overworld').spawnEntity(KAI_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
    kaiSceneFinalPo.teleport(stv('4072.5 42 7997.5'), { rotation: { y: 180, x: 0 } });
    yield* delay(98);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_kai_3_2_start');
    kaiSceneFinalPo.setProperty('noxcrew:scene', 32);
    yield* delay(98);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_kai_3_3_start', {
            easeOptions: { easeTime: 1, easeType: EasingType.Linear },
        });
    kaiSceneFinalPo.setProperty('noxcrew:scene', 33);
    yield* delay(100);
    kaiSceneFinalPo.remove();
    kaiSceneFinal.setProperty('noxcrew:scene', 35);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_kai_3_5_start');
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_kai_3_5_end', {
            easeOptions: { easeTime: 2, easeType: EasingType.Linear },
        });
    yield* delay(39);
    kaiSceneFinal.setProperty('noxcrew:scene', 36);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_kai_3_6_start');
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_kai_3_6_end', {
            easeOptions: { easeTime: 11, easeType: EasingType.Linear },
        });
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.runCommandAsync('fog @s push noxcrew.kp:spirit_realm spirit_fog');
    }
    yield* delay(199);
    kaiSceneFinal.remove();
    for (const player of world.getPlayers(NOT_ADMIN)) {
        titleManager.addTitle({
            ...TITLES.letterbox_out,
            targets: new Set().add(player),
        });
    }
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.removeEffect('invisibility');
        player.runCommandAsync('inputpermission set @s movement enabled');
        player.runCommandAsync('gamemode adventure');
        player.runCommandAsync('fog @s remove spirit_fog');
        player.teleport(offsetSpawn(stv('4079 131 8048'), 1), { rotation: { y: -90, x: 0 } });
        player.camera.clear();
    }
}
