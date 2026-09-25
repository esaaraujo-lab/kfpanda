import { world } from "@minecraft/server";
import { EasingType } from "@minecraft/server";
import { delay } from "noxcrew.common.scripting/index.js";
import ADMIN_TAG from "../../player/disable.js";
import { TITLES } from "../../titles.js";
import { offsetSpawn } from "../../util/offsetSpawn.js";
import { RemoveEntityFamily, RemoveEntityType } from "../../util/removeEntity.js";
import { stringToVector3 } from "../../util/stringToVector3.js";
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
const LORDSHEN_ENTITY_CUTSCENE = 'noxcrew.kp:lord_shen_cutscene';
const CRANE_ENTITY_CUTSCENE = 'noxcrew.kp:crane_cutscene';
const MANTIS_ENTITY_CUTSCENE = 'noxcrew.kp:mantis_cutscene';
const MONKEY_ENTITY_CUTSCENE = 'noxcrew.kp:monkey_cutscene';
const TIGRESS_ENTITY_CUTSCENE = 'noxcrew.kp:tigress_cutscene';
const VIPER_ENTITY_CUTSCENE = 'noxcrew.kp:viper_cutscene';
const SHEN_BOAT_ENTITY_CUTSCENE = 'noxcrew.kp:shen_boat';
const CANAL_BOAT_ENTITY_CUTSCENE = 'noxcrew.kp:canal_boats';
const stv = stringToVector3;
export function CreateLordShenS1Sequence(titleManager, preLoad) {
    return function* startStage1() {
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.fade(endfade);
        yield* delay(35);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.playSound('versus_screen');
        for (const player of world.getPlayers(NOT_ADMIN)) {
            titleManager.addTitle({
                ...TITLES.boss_title_shen,
                targets: new Set().add(player),
            });
        }
        world.getDimension('overworld').runCommandAsync(`structure load noxcrew:ls_bridge_reset 2024 -56 6100`);
        world.getDimension('overworld').runCommandAsync(`structure load noxcrew:ls_hull_reset 2049 -55 6127`);
        world.getDimension('overworld').runCommandAsync(`structure load noxcrew:ls_mast_reset 2044 -55 6098`);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.fade(fade);
        yield* delay(50);
        world.setTimeOfDay(13000);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.teleport(stv('2182 -34 6138'));
        preLoad();
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.addEffect('invisibility', 20000000, { amplifier: 1, showParticles: false });
            player.runCommand('inputpermission set @s movement disabled');
            player.runCommandAsync('gamemode spectator');
        }
        yield* delay(10);
        fixBoatRot();
        yield* delay(140);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.playSound('shen_opening');
        for (const player of world.getPlayers(NOT_ADMIN)) {
            titleManager.addTitle({
                ...TITLES.boss_in_shen,
                targets: new Set().add(player),
            });
            player.camera.setCamera('noxcrew_kp:boss_shen_1_1_start');
            player.camera.setCamera('noxcrew_kp:boss_shen_1_1_end', {
                easeOptions: { easeTime: 10, easeType: EasingType.InOutSine },
            });
        }
        yield* delay(200);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.camera.setCamera('noxcrew_kp:boss_shen_1_2_start');
            player.camera.setCamera('noxcrew_kp:boss_shen_1_2_end', {
                easeOptions: { easeTime: 6, easeType: EasingType.Linear },
            });
        }
        yield* delay(120);
        const shenScene1314 = world.getDimension('overworld').spawnEntity(LORDSHEN_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
        shenScene1314.setProperty('noxcrew:scene', 13);
        shenScene1314.teleport({ x: 2231, y: -50.8, z: 6115 });
        shenScene1314.runCommandAsync(`ride @s start_riding @e[type=${SHEN_BOAT_ENTITY_CUTSCENE}]`);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.camera.setCamera('noxcrew_kp:boss_shen_1_3_start');
            player.camera.setCamera('noxcrew_kp:boss_shen_1_3_end', {
                easeOptions: { easeTime: 8, easeType: EasingType.Linear },
            });
        }
        yield* delay(160);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_shen_1_4_start');
        shenScene1314.setProperty('noxcrew:scene', 14);
        const shenScene15 = world.getDimension('overworld').spawnEntity(LORDSHEN_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
        shenScene15.teleport(stringToVector3('2178.0 -23 6136'), { rotation: { y: 45, x: 0 } });
        yield* delay(90);
        shenScene15.setProperty('noxcrew:scene', 15);
        yield* delay(10);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.camera.setCamera('noxcrew_kp:boss_shen_1_5_start');
            player.camera.setCamera('noxcrew_kp:boss_shen_1_5_end', {
                easeOptions: { easeTime: 6, easeType: EasingType.InOutSine },
            });
        }
        yield* delay(130);
        shenScene15.remove();
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.fade(quickfade);
        yield* delay(30);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.removeEffect('invisibility');
            player.runCommandAsync('inputpermission set @s movement enabled');
            player.runCommandAsync('gamemode adventure');
            player.teleport(offsetSpawn(stv('2177 -45 6130'), 2), { rotation: { y: -90, x: 0 } });
            titleManager.addTitle({
                ...TITLES.letterbox_out,
                targets: new Set().add(player),
            });
            player.camera.clear();
        }
    };
}
export function CreateLordShenS2Sequence(titleManager, preLoad) {
    return function* startStage2() {
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.fade(quickfade);
        yield* delay(20);
        RemoveEntityFamily(['lord_shen_fight']);
        yield* delay(10);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.teleport(stv('2045 -42 6133'));
        preLoad();
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.addEffect('invisibility', 20000000, { amplifier: 1, showParticles: false });
            player.runCommand('inputpermission set @s movement disabled');
            player.runCommandAsync('gamemode spectator');
        }
        loadTransitionBoats();
        yield* delay(40);
        const shenScenePo = world.getDimension('overworld').spawnEntity(LORDSHEN_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
        shenScenePo.teleport(stringToVector3('2028 -42 6115'), { rotation: { y: -90, x: 0 } });
        shenScenePo.setProperty('noxcrew:scene', 21);
        summonF5();
        for (const player of world.getPlayers(NOT_ADMIN)) {
            titleManager.addTitle({
                ...TITLES.letterbox_in,
                targets: new Set().add(player),
            });
            player.camera.setCamera('noxcrew_kp:boss_shen_2_1_start');
            player.camera.setCamera('noxcrew_kp:boss_shen_2_1_end', {
                easeOptions: { easeTime: 10, easeType: EasingType.InOutSine },
            });
        }
        yield* delay(200);
        shenScenePo.setProperty('noxcrew:scene', 22);
        actionF5('rasberry');
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_shen_2_2_start');
        yield* delay(20);
        RemoveEntityType(CANAL_BOAT_ENTITY_CUTSCENE);
        const shenBoatSceneEntity = world
            .getDimension('overworld')
            .spawnEntity(SHEN_BOAT_ENTITY_CUTSCENE, { x: 2076, y: -53, z: 6115 });
        shenBoatSceneEntity.setRotation({ y: 90, x: 0 });
        const shenScene2324 = world.getDimension('overworld').spawnEntity(LORDSHEN_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
        shenScene2324.setProperty('noxcrew:scene', 23);
        shenScene2324.teleport({ x: 2076, y: -53, z: 6115 });
        shenScene2324.runCommandAsync(`ride @s start_riding @e[type=${SHEN_BOAT_ENTITY_CUTSCENE}]`);
        yield* delay(40);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_shen_2_3_start');
        yield* delay(60);
        shenScene2324.setProperty('noxcrew:scene', 24);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.camera.setCamera('noxcrew_kp:boss_shen_2_4_start', {
                easeOptions: { easeTime: 4, easeType: EasingType.InSine },
            });
        }
        yield* delay(110);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_shen_2_5_start');
        shenScenePo.setProperty('noxcrew:scene', 25);
        actionF5('retreat');
        yield* delay(60);
        for (const player of world.getPlayers(NOT_ADMIN))
            player.camera.setCamera('noxcrew_kp:boss_shen_2_6_start');
        world.getDimension('overworld').spawnParticle('noxcrew.kp:shen_explosion_1', stringToVector3('2000 -42 6115'));
        RemoveEntityFamily(['lord_shen_fight']);
        RemoveEntityFamily(['shen_cutscene']);
        yield* delay(70);
        for (const player of world.getPlayers(NOT_ADMIN)) {
            player.removeEffect('invisibility');
            player.runCommandAsync('inputpermission set @s movement enabled');
            player.runCommandAsync('gamemode adventure');
            player.teleport(offsetSpawn(stv('1954 -49 8120'), 2), { rotation: { y: -90, x: 0 } });
            titleManager.addTitle({
                ...TITLES.letterbox_out,
                targets: new Set().add(player),
            });
            player.camera.clear();
        }
    };
}
export function* LordShenEndFight(titleManager) {
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(endfade);
    yield* delay(30);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.teleport(stv('1950 -48 8119'));
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.addEffect('invisibility', 20000000, { amplifier: 1, showParticles: false });
        player.runCommand('inputpermission set @s movement disabled');
        player.runCommandAsync('gamemode spectator');
    }
    yield* delay(20);
    const tntStockpile = world.getDimension('overworld').spawnEntity('noxcrew.kp:tnt_stockpile', { x: 0, y: 0, z: 0 });
    tntStockpile.teleport(stringToVector3('1987.5 -48 8123.5'));
    const shenSceneFinal = world.getDimension('overworld').spawnEntity(LORDSHEN_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
    shenSceneFinal.setProperty('noxcrew:scene', 31);
    shenSceneFinal.teleport(stringToVector3('1982.5 -49 8120.5'), { rotation: { y: 0, x: 0 } });
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        titleManager.addTitle({
            ...TITLES.boss_out_shen,
            targets: new Set().add(player),
        });
        player.camera.setCamera('noxcrew_kp:boss_shen_3_1_start');
        player.camera.setCamera('noxcrew_kp:boss_shen_3_1_end', {
            easeOptions: { easeTime: 6, easeType: EasingType.Linear },
        });
    }
    yield* delay(120);
    shenSceneFinal.setProperty('noxcrew:scene', 32);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_shen_3_2_start');
    yield* delay(60);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_shen_3_2_end');
    yield* delay(60);
    shenSceneFinal.setProperty('noxcrew:scene', 33);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_shen_3_3_start');
    yield* delay(80);
    shenSceneFinal.setProperty('noxcrew:scene', 34);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_shen_3_4_start', {
            easeOptions: { easeTime: 3, easeType: EasingType.InSine },
        });
    yield* delay(80);
    shenSceneFinal.setProperty('noxcrew:scene', 35);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_shen_3_5_start');
    yield* delay(30);
    world.getDimension('overworld').spawnParticle('noxcrew.kp:shen_explosion_1', stringToVector3('1985 -48 8120'));
    world.getDimension('overworld').spawnParticle('noxcrew.kp:shen_explosion_2', stringToVector3('1985 -48 8120'));
    world.getDimension('overworld').spawnParticle('noxcrew.kp:shen_explosion_1', stringToVector3('1967 -48 8120'));
    world.getDimension('overworld').spawnParticle('noxcrew.kp:shen_explosion_2', stringToVector3('1967 -48 8120'));
    yield* delay(10);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.setCamera('noxcrew_kp:boss_shen_3_6_start');
    shenSceneFinal.setProperty('noxcrew:scene', 36);
    yield* delay(40);
    const shenCannon = world.getDimension('overworld').getEntities({
        type: 'noxcrew.kp:shen_cannon',
    })[0];
    if (shenCannon)
        shenCannon.triggerEvent('noxcrew:set.damage.3');
    yield* delay(140);
    shenSceneFinal.remove();
    tntStockpile.remove();
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.removeEffect('invisibility');
        player.runCommandAsync('inputpermission set @s movement enabled');
        player.runCommandAsync('gamemode adventure');
        player.teleport(stv('1950 -48 8119'), { rotation: { y: -90, x: 0 } });
        titleManager.addTitle({
            ...TITLES.letterbox_out,
            targets: new Set().add(player),
        });
        player.camera.clear();
    }
}
const CANAL_BOAT_LOCATIONS = [
    { location: { x: 2111, y: -50, z: 6123 }, rotation: { y: 147, x: 20 } },
    { location: { x: 2100, y: -50, z: 6108 }, rotation: { y: 58, x: 17 } },
    { location: { x: 2087, y: -50, z: 6122 }, rotation: { y: 93, x: 26 } },
    { location: { x: 2085, y: -50, z: 6111 }, rotation: { y: 37, x: 13 } },
    { location: { x: 2065, y: -50, z: 6111 }, rotation: { y: 71, x: 21 } },
    { location: { x: 2052, y: -50, z: 6118 }, rotation: { y: 155, x: 10 } },
    { location: { x: 2070, y: -50, z: 6120 }, rotation: { y: 48, x: 13 } },
    { location: { x: 2041, y: -50, z: 6115 }, rotation: { y: 30, x: 20 } },
];
function loadTransitionBoats() {
    world.getDimension('overworld').runCommandAsync(`structure load noxcrew:ls_bridge 2024 -56 6100`);
    world.getDimension('overworld').runCommandAsync(`structure load noxcrew:ls_hull 2049 -55 6127`);
    world.getDimension('overworld').runCommandAsync(`structure load noxcrew:ls_mast 2044 -55 6098`);
    for (const canalBoats of CANAL_BOAT_LOCATIONS) {
        const canalBoat = world.getDimension('overworld').spawnEntity(CANAL_BOAT_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
        canalBoat.triggerEvent('noxcrew:set.sink.true');
        canalBoat.teleport(canalBoats.location, { rotation: canalBoats.rotation });
    }
}
function fixBoatRot() {
    let boats = world.getDimension('overworld').getEntities({
        families: ['canal_boats'],
    });
    for (const entity of boats) {
        entity.teleport({ x: entity.location.x, y: entity.location.y + 0.1, z: entity.location.z }, { rotation: { y: 90, x: 0 } });
    }
}
function summonF5() {
    const f5Crane = world.getDimension('overworld').spawnEntity(CRANE_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
    const f5Mantis = world.getDimension('overworld').spawnEntity(MANTIS_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
    const f5Monkey = world.getDimension('overworld').spawnEntity(MONKEY_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
    const f5Tigress = world.getDimension('overworld').spawnEntity(TIGRESS_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
    const f5Viper = world.getDimension('overworld').spawnEntity(VIPER_ENTITY_CUTSCENE, { x: 0, y: 0, z: 0 });
    f5Crane.teleport(stv('2028 -42 6117'), { rotation: { y: -90, x: 0 } });
    f5Mantis.teleport(stv('2028 -42 6119'), { rotation: { y: -90, x: 0 } });
    f5Monkey.teleport(stv('2028 -42 6121'), { rotation: { y: -90, x: 0 } });
    f5Tigress.teleport(stv('2028 -42 6113'), { rotation: { y: -90, x: 0 } });
    f5Viper.teleport(stv('2028 -42 6111'), { rotation: { y: -90, x: 0 } });
}
function actionF5(state) {
    const f5 = world.getDimension('overworld').getEntities({
        families: ['furious5', 'shen_cutscene'],
    });
    for (const entity of f5) {
        entity.setProperty(`noxcrew:${state}`, true);
    }
}
