import { world } from "@minecraft/server";
import { EasingType } from "@minecraft/server";
import { TitleManagerV2, delay } from "noxcrew.common.scripting/index.js";
import { TITLES } from "./titles.js";
import ADMIN_TAG from "./player/disable.js";
import { stringToVector3 } from "./util/stringToVector3.js";
import { giveTeleportScroll } from "./mapStart.js";
import { offsetSpawn } from "./util/offsetSpawn.js";
const quickfade = {
    fadeColor: { blue: 0.09, red: 0.109, green: 0.09 },
    fadeTime: { fadeInTime: 1, holdTime: 1, fadeOutTime: 1 },
};
const endfade = {
    fadeColor: { blue: 0.09, red: 0.109, green: 0.09 },
    fadeTime: { fadeInTime: 1, holdTime: 3, fadeOutTime: 1 },
};
const NOT_ADMIN = { excludeTags: [ADMIN_TAG] };
export function* seqActivityCountdown(activity) {
    const titleManager = activity.container.inject(TitleManagerV2);
    for (let i = 3; i > 0; --i) {
        titleManager.addTitle(TITLES[`countdown${i}`]);
        for (const player of world.getAllPlayers()) {
            player.playSound('activity_count', { location: player.location });
        }
        yield* delay(20);
    }
    titleManager.addTitle(TITLES.countdown_go);
    for (const player of world.getAllPlayers()) {
        player.playSound('activity_start', { location: player.location });
    }
    world.getDimension('overworld').runCommandAsync(`function music/${activity.gameKey}`);
}
export function* seqActivityTraining(identifier, locations, endCallback) {
    for (let i = 0; i < locations.length; ++i) {
        world.getDimension('overworld').spawnEntity(identifier, locations[i]);
        if (i == locations.length - 3) {
            for (const player of world.getAllPlayers()) {
                player.sendMessage({ translate: 'txt.gs.msg2' });
                player.playSound('activity_timer_30', { location: player.location });
            }
        }
        yield* delay(200);
    }
    endCallback();
}
export function* seqActivityWolfBossSlam(wolf) {
    yield* delay(15);
    for (const player of world.getDimension('overworld').getPlayers({ location: wolf.location, maxDistance: 6 })) {
        player.applyDamage(4);
        player.applyKnockback(player.location.x - wolf.location.x, player.location.z - wolf.location.z, 5, 0.3);
    }
    yield* delay(40);
}
export function* seqAcademyOpening(titleManager) {
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(endfade);
    yield* delay(30);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.runCommand('inputpermission set @s movement disabled');
        player.runCommandAsync('gamemode spectator');
        player.teleport({ x: -1944, y: 226, z: 54 });
    }
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        titleManager.addTitle({
            ...TITLES.letterbox_academy,
            targets: new Set().add(player),
        });
        player.camera.setCamera('noxcrew_kp:cutscene_area_academy_start');
        yield* delay(20);
        player.camera.setCamera('noxcrew_kp:cutscene_area_academy_end', {
            easeOptions: { easeTime: 8, easeType: EasingType.InOutCubic },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.runCommandAsync('inputpermission set @s movement enabled');
        player.runCommandAsync('gamemode adventure');
        titleManager.addTitle({
            ...TITLES.letterbox_out,
            targets: new Set().add(player),
        });
        player.camera.clear();
        player.teleport({ x: -1944, y: 226, z: 54 });
    }
    titleManager.addTitle({
        type: 'one-off',
        weight: 1,
        components: { actionbar: { rawtext: [{ translate: 'txt.gs.msg5' }] } },
        duration: 300,
    });
    yield* delay(20);
}
export function* seqIntroductionTutorial(titleManager) {
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.runCommand('inputpermission set @s movement disabled');
        player.runCommandAsync('gamemode spectator');
        player.teleport(stringToVector3('131 79 62'));
        player.camera.fade({
            fadeColor: quickfade.fadeColor,
            fadeTime: {
                fadeInTime: 0,
                fadeOutTime: 0,
                holdTime: 2,
            },
        });
    }
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        titleManager.addTitle({
            ...TITLES.letterbox_brand,
            targets: new Set().add(player),
        });
    }
    yield* delay(190);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.playSound('noxcrew');
    yield* delay(110);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:opening_1_start');
    yield* delay(110);
    titleManager.addTitle({
        type: 'one-off',
        duration: 120,
        weight: 0,
        components: { actionbar: { rawtext: [{ translate: `txt.tut.msg1` }] } },
    });
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:opening_1_end', {
            easeOptions: { easeTime: 4, easeType: EasingType.InSine },
        });
    yield* delay(80);
    world.getDimension('overworld').spawnParticle('noxcrew.kp:intro_confetti', stringToVector3('198 58 62'));
    world.getDimension('overworld').spawnParticle('noxcrew.kp:intro_confetti_explode', stringToVector3('200 52 62'));
    summonF5(true);
    yield* delay(100);
    let removeEntites = world.getDimension('overworld').getEntities({
        families: ['furious5'],
        location: stringToVector3('199 51 60'),
        maxDistance: 10,
        closest: 5,
    });
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(30);
    for (const entity of removeEntites) {
        entity.triggerEvent('noxcrew:despawn');
    }
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:opening_2_start');
        player.camera.setCamera('noxcrew_kp:opening_2_end', {
            easeOptions: { easeTime: 8, easeType: EasingType.Linear },
        });
    }
    yield* delay(20);
    titleManager.addTitle({
        type: 'one-off',
        duration: 100,
        weight: 0,
        components: { actionbar: { rawtext: [{ translate: `txt.tut.msg2` }] } },
    });
    const po = world.getDimension('overworld').getEntities({
        type: 'noxcrew.kp:po',
        location: stringToVector3('131 82 70'),
        closest: 1,
    })[0];
    po.triggerEvent('noxcrew:play.special_13');
    yield* delay(120);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.teleport(stringToVector3('106 72 195'));
    }
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:opening_3_start');
        player.camera.setCamera('noxcrew_kp:opening_3_end', {
            easeOptions: { easeTime: 7, easeType: EasingType.InSine },
        });
    }
    yield* delay(30);
    world.getDimension('overworld').spawnParticle('noxcrew.kp:tutorial_sparkle', stringToVector3('106.5 74 216'));
    titleManager.addTitle({
        type: 'one-off',
        duration: 80,
        weight: 0,
        components: { actionbar: { rawtext: [{ translate: `txt.tut.msg3` }] } },
    });
    yield* delay(90);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.teleport({ x: 75, y: 77, z: 128 });
    }
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:opening_4_start');
        player.camera.setCamera('noxcrew_kp:opening_4_end', {
            easeOptions: { easeTime: 7, easeType: EasingType.InSine },
        });
    }
    yield* delay(30);
    world.getDimension('overworld').spawnParticle('noxcrew.kp:tutorial_sparkle', stringToVector3('48 85 145.5'));
    titleManager.addTitle({
        type: 'one-off',
        duration: 80,
        weight: 0,
        components: { actionbar: { rawtext: [{ translate: `txt.tut.msg4` }] } },
    });
    yield* delay(90);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.teleport({ x: 131, y: 82, z: 62 });
    }
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:opening_5_start');
        player.camera.setCamera('noxcrew_kp:opening_5_end', {
            easeOptions: { easeTime: 15, easeType: EasingType.Linear },
        });
    }
    yield* delay(30);
    titleManager.addTitle({
        type: 'one-off',
        duration: 200,
        weight: 0,
        components: { actionbar: { rawtext: [{ translate: `txt.tut.msg5` }] } },
    });
    yield* delay(250);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:opening_6_start');
        player.camera.setCamera('noxcrew_kp:opening_6_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.Linear },
        });
    }
    yield* delay(30);
    world.getDimension('overworld').spawnParticle('noxcrew.kp:tutorial_sparkle', stringToVector3('145 77 62'));
    titleManager.addTitle({
        type: 'one-off',
        duration: 80,
        weight: 0,
        components: { actionbar: { rawtext: [{ translate: `txt.tut.msg6` }] } },
    });
    yield* delay(150);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:opening_7_start');
        player.camera.setCamera('noxcrew_kp:opening_7_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.Linear },
        });
    }
    yield* delay(40);
    titleManager.addTitle({
        type: 'one-off',
        duration: 100,
        weight: 0,
        components: { actionbar: { rawtext: [{ translate: `txt.tut.msg7` }] } },
    });
    yield* delay(140);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    world.setDynamicProperty('noxcrew.kp:start_map', 'started');
    summonF5(false);
    po.triggerEvent('noxcrew:location.jade.activate');
    for (const player of world.getPlayers(NOT_ADMIN)) {
        giveTeleportScroll(player);
        player.teleport(offsetSpawn(stringToVector3('131 82 62'), 2));
        player.runCommandAsync('inputpermission set @s movement enabled');
        player.runCommandAsync('gamemode adventure');
        player.camera.clear();
    }
}
const CRANE_ENTITY = 'noxcrew.kp:crane';
const MANTIS_ENTITY = 'noxcrew.kp:mantis';
const MONKEY_ENTITY = 'noxcrew.kp:monkey';
const TIGRESS_ENTITY = 'noxcrew.kp:tigress';
const VIPER_ENTITY = 'noxcrew.kp:viper';
function summonF5(isCutscene) {
    const f5Crane = world.getDimension('overworld').spawnEntity(CRANE_ENTITY, { x: 0, y: 0, z: 0 });
    const f5Mantis = world.getDimension('overworld').spawnEntity(MANTIS_ENTITY, { x: 0, y: 0, z: 0 });
    const f5Monkey = world.getDimension('overworld').spawnEntity(MONKEY_ENTITY, { x: 0, y: 0, z: 0 });
    const f5Tigress = world.getDimension('overworld').spawnEntity(TIGRESS_ENTITY, { x: 0, y: 0, z: 0 });
    const f5Viper = world.getDimension('overworld').spawnEntity(VIPER_ENTITY, { x: 0, y: 0, z: 0 });
    if (isCutscene) {
        f5Tigress.teleport(stringToVector3('200.33 51 64.15'), { rotation: { y: -90, x: 0 } });
        f5Mantis.teleport(stringToVector3('198.8 51 62.8'), { rotation: { y: -90, x: 0 } });
        f5Monkey.teleport(stringToVector3('199.62 51 60.07'), { rotation: { y: -90, x: 0 } });
        f5Viper.teleport(stringToVector3('200.54 51 61.28'), { rotation: { y: -90, x: 0 } });
        f5Crane.teleport(stringToVector3('200.05 51 62.42'), { rotation: { y: -90, x: 0 } });
    }
    else {
        f5Tigress.triggerEvent('noxcrew:set.npc');
        f5Mantis.triggerEvent('noxcrew:set.npc');
        f5Monkey.triggerEvent('noxcrew:set.npc');
        f5Viper.triggerEvent('noxcrew:set.npc');
        f5Crane.triggerEvent('noxcrew:set.npc');
    }
}
