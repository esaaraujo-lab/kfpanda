import { world } from "@minecraft/server";
import { EasingType } from "@minecraft/server";
import { delay } from "noxcrew.common.scripting/index.js";
import { TITLES } from "./titles.js";
import { RemoveEntityFamily } from "./util/removeEntity.js";
import ADMIN_TAG from "./player/disable.js";
import { stringToVector3 } from "./util/stringToVector3.js";
import { CookingActivity } from "./activity/cooking.js";
const quickfade = {
    fadeColor: { blue: 0.09, red: 0.109, green: 0.09 },
    fadeTime: { fadeInTime: 1, holdTime: 1, fadeOutTime: 1 },
};
const endfade = {
    fadeColor: { blue: 0.09, red: 0.109, green: 0.09 },
    fadeTime: { fadeInTime: 1, holdTime: 2, fadeOutTime: 1 },
};
const NOT_ADMIN = { excludeTags: [ADMIN_TAG] };
const TUTORIAL_DUMPLING = 'noxcrew.kp:dragon_warrior_dumpling';
const TUTORIAL_DUMPLING_LOCATIONS = [
    { location: { x: 4077, y: 127, z: 2171 } },
    { location: { x: 4077, y: 127, z: 2177 } },
    { location: { x: 4077, y: 127, z: 2183 } },
    { location: { x: 4044, y: 123, z: 2143 } },
    { location: { x: 4047, y: 125, z: 2135 } },
    { location: { x: 4043, y: 130, z: 2128 } },
    { location: { x: 4048, y: 130, z: 2120 } },
    { location: { x: 4050, y: 129, z: 2113 } },
    { location: { x: 4054, y: 131, z: 2107 } },
    { location: { x: 4060, y: 134, z: 2098 } },
    { location: { x: 4065, y: 137, z: 2094 } },
    { location: { x: 4073, y: 140, z: 2094 } },
];
function loadTutorialDumplings() {
    for (const tutorialDumplings of TUTORIAL_DUMPLING_LOCATIONS) {
        const tutorialDumpling = world.getDimension('overworld').spawnEntity(TUTORIAL_DUMPLING, { x: 0, y: 0, z: 0 });
        tutorialDumpling.triggerEvent('noxcrew:set.tutorial_dumpling');
        tutorialDumpling.teleport(tutorialDumplings.location);
    }
}
export function* seqTutorialParkour(titleManager) {
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.addEffect('invisibility', 20000000, { amplifier: 1, showParticles: false });
        player.runCommandAsync('inputpermission set @s movement disabled');
        player.teleport({ x: 4029, y: 120, z: 2151 });
    }
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        titleManager.addTitle({
            ...TITLES.letterbox_instant,
            targets: new Set().add(player),
        });
    }
    loadTutorialDumplings();
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:parkour_tut_1_start');
        player.camera.setCamera('noxcrew_kp:parkour_tut_1_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_parkour.tut1` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(40);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:parkour_tut_2_start');
        player.camera.setCamera('noxcrew_kp:parkour_tut_2_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_parkour.tut2` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(40);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:parkour_tut_3_start');
        player.camera.setCamera('noxcrew_kp:parkour_tut_3_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_parkour.tut3` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(40);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:parkour_tut_4_start');
        player.camera.setCamera('noxcrew_kp:parkour_tut_4_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_parkour.tut4` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(endfade);
    yield* delay(40);
    RemoveEntityFamily(['tutorial_dumpling']);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.runCommandAsync('inputpermission set @s movement enabled');
        titleManager.addTitle({
            ...TITLES.letterbox_out,
            targets: new Set().add(player),
        });
        player.camera.clear();
    }
    yield* delay(20);
}
export function* seqTutorialCookingDumplings(titleManager) {
    const DUMPLING_CUSTOMER_LOCATIONS = [
        { location: { x: 4073, y: 123, z: 4121 }, group: 'a' },
        { location: { x: 4084, y: 123, z: 4117 }, group: 'b' },
        { location: { x: 4084, y: 123, z: 4121 }, group: 'b' },
        { location: { x: 4088, y: 123, z: 4128 }, group: 'b' },
        { location: { x: 4088, y: 123, z: 4130 }, group: 'b' },
        { location: { x: 4064, y: 127, z: 4108 }, group: 'a' },
    ];
    function loadTutorialDumplingCustomers() {
        for (const tutorialDumplingCustomers of DUMPLING_CUSTOMER_LOCATIONS) {
            const tutorialDumplingCustomer = world
                .getDimension('overworld')
                .spawnEntity('noxcrew.kp:customer', { x: 0, y: 0, z: 0 });
            tutorialDumplingCustomer.triggerEvent('noxcrew:spawn.panda');
            tutorialDumplingCustomer.triggerEvent('noxcrew:set.tutorial_customer');
            tutorialDumplingCustomer.triggerEvent(`noxcrew:set.group.${tutorialDumplingCustomers.group}`);
            tutorialDumplingCustomer.teleport(tutorialDumplingCustomers.location);
        }
    }
    for (const seat of world.getDimension('overworld').getEntities({ type: 'noxcrew.kp:restaurant_seat' })) {
        seat.triggerEvent('noxcrew:to.seat_available');
    }
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.addEffect('invisibility', 20000000, { amplifier: 1, showParticles: false });
        player.runCommandAsync('inputpermission set @s movement disabled');
        player.teleport({ x: 4079, y: 123, z: 4104 });
    }
    loadTutorialDumplingCustomers();
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        titleManager.addTitle({
            ...TITLES.letterbox_instant,
            targets: new Set().add(player),
        });
    }
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:cooking_dumplings_tut_1_start');
        player.camera.setCamera('noxcrew_kp:cooking_dumplings_tut_1_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_dumplings.tut1` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(40);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:cooking_dumplings_tut_2_start');
        player.camera.setCamera('noxcrew_kp:cooking_dumplings_tut_2_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_dumplings.tut2` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    RemoveEntityFamily(['tutorial_customer']);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:cooking_dumplings_tut_3_start');
        player.camera.setCamera('noxcrew_kp:cooking_dumplings_tut_3_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InCubic },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_dumplings.tut3` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(40);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:cooking_dumplings_tut_4_start');
        player.camera.setCamera('noxcrew_kp:cooking_dumplings_tut_4_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_dumplings.tut4` }] } },
        });
    }
    const steamingStations = world.getDimension('overworld').getEntities({ type: 'noxcrew.kp:steaming_station' });
    steamingStations.forEach(e => {
        e.triggerEvent('noxcrew:to.state.boiling');
    });
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(40);
    steamingStations.forEach(e => {
        e.triggerEvent('noxcrew:set.state.waiting');
    });
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:cooking_dumplings_tut_5_start');
        player.camera.setCamera('noxcrew_kp:cooking_dumplings_tut_5_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_dumplings.tut5` }] } },
        });
    }
    const workStations = world.getDimension('overworld').getEntities({ type: 'noxcrew.kp:work_station' });
    workStations.forEach(e => {
        if (Math.floor(Math.random() * 2) == 0) {
            e.triggerEvent('noxcrew:set.item.bamboo_shoots');
        }
        else {
            e.triggerEvent('noxcrew:set.item.red_radish');
        }
        e.triggerEvent('noxcrew:to.chopping');
    });
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    yield* delay(20);
    workStations.forEach(e => {
        e.triggerEvent('noxcrew:set.item.none');
    });
    const tutorialDumplingCustomerWant = world
        .getDimension('overworld')
        .spawnEntity('noxcrew.kp:customer', { x: 0, y: 0, z: 0 });
    tutorialDumplingCustomerWant.teleport(stringToVector3('4073 123 4121'), { rotation: { y: 180, x: 0 } });
    tutorialDumplingCustomerWant.triggerEvent('noxcrew:spawn.panda');
    tutorialDumplingCustomerWant.triggerEvent('noxcrew:set.group.b');
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:cooking_dumplings_tut_6_start');
        player.camera.setCamera('noxcrew_kp:cooking_dumplings_tut_6_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_dumplings.tut6` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    tutorialDumplingCustomerWant.triggerEvent('noxcrew:set.tutorial_customer');
    RemoveEntityFamily(['tutorial_customer']);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:cooking_dumplings_tut_7_start');
        player.camera.setCamera('noxcrew_kp:cooking_dumplings_tut_7_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_dumplings.tut7` }] } },
        });
    }
    const serveStations = world.getDimension('overworld').getEntities({ type: 'noxcrew.kp:serving_station' });
    serveStations.forEach(e => {
        e.triggerEvent('noxcrew:set.item.noodle_bowl');
    });
    yield* delay(80);
    serveStations.forEach(e => {
        if (Math.floor(Math.random() * 2) == 0) {
            e.triggerEvent('noxcrew:set.item.dumpling_bowl_bamboo');
        }
        else {
            e.triggerEvent('noxcrew:set.item.dumpling_bowl_radish');
        }
    });
    yield* delay(100);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    loadTutorialDumplingCustomers();
    serveStations.forEach(e => {
        e.triggerEvent('noxcrew:set.item.none');
    });
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:cooking_dumplings_tut_8_start');
        player.camera.setCamera('noxcrew_kp:cooking_dumplings_tut_8_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_dumplings.tut8` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    RemoveEntityFamily(['tutorial_customer']);
    const tutorialDumplingCustomerAngry = world
        .getDimension('overworld')
        .spawnEntity('noxcrew.kp:customer', { x: 0, y: 0, z: 0 });
    tutorialDumplingCustomerAngry.teleport(stringToVector3('4072 123 4127'), { rotation: { y: 0, x: 0 } });
    tutorialDumplingCustomerAngry.triggerEvent('noxcrew:spawn.panda');
    tutorialDumplingCustomerAngry.triggerEvent('noxcrew:set.group.e');
    tutorialDumplingCustomerAngry.triggerEvent('noxcrew:set.emotion.angry');
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:cooking_dumplings_tut_9_start');
        player.camera.setCamera('noxcrew_kp:cooking_dumplings_tut_9_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_dumplings.tut9` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    tutorialDumplingCustomerAngry.triggerEvent('noxcrew:set.tutorial_customer');
    RemoveEntityFamily(['tutorial_customer']);
    loadTutorialDumplingCustomers();
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:cooking_dumplings_tut_10_start');
        player.camera.setCamera('noxcrew_kp:cooking_dumplings_tut_10_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_dumplings.tut10` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(endfade);
    yield* delay(40);
    RemoveEntityFamily(['tutorial_customer']);
    CookingActivity.cleanStations();
    for (const player of world.getPlayers(NOT_ADMIN)) {
        titleManager.addTitle({
            ...TITLES.letterbox_out,
            targets: new Set().add(player),
        });
        player.camera.clear();
    }
    yield* delay(20);
}
export function* seqTutorialCookingNoodles(titleManager) {
    const NOODLE_CUSTOMER_LOCATIONS = [
        { location: stringToVector3('510 -52 2036') },
        { location: stringToVector3('514 -52 2038') },
        { location: stringToVector3('510 -52 2041') },
        { location: stringToVector3('512 -52 2045') },
        { location: stringToVector3('518 -52 2034') },
        { location: stringToVector3('522 -52 2036') },
        { location: stringToVector3('521 -52 2042') },
        { location: stringToVector3('521 -52 2046') },
    ];
    function loadTutorialNoodleCustomers() {
        for (const tutorialNoodleCustomers of NOODLE_CUSTOMER_LOCATIONS) {
            const tutorialNoodleCustomer = world
                .getDimension('overworld')
                .spawnEntity('noxcrew.kp:customer', { x: 0, y: 0, z: 0 });
            tutorialNoodleCustomer.triggerEvent('noxcrew:spawn.peace');
            tutorialNoodleCustomer.triggerEvent('noxcrew:set.tutorial_customer');
            tutorialNoodleCustomer.triggerEvent('noxcrew:set.group.a');
            tutorialNoodleCustomer.teleport(tutorialNoodleCustomers.location);
        }
    }
    for (const seat of world.getDimension('overworld').getEntities({ type: 'noxcrew.kp:restaurant_seat' })) {
        seat.triggerEvent('noxcrew:to.seat_available');
    }
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.addEffect('invisibility', 20000000, { amplifier: 1, showParticles: false });
        player.runCommandAsync('inputpermission set @s movement disabled');
        player.teleport({ x: 520, y: -52, z: 2068 });
    }
    loadTutorialNoodleCustomers();
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        titleManager.addTitle({
            ...TITLES.letterbox_instant,
            targets: new Set().add(player),
        });
    }
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:cooking_noodles_tut_1_start');
        player.camera.setCamera('noxcrew_kp:cooking_noodles_tut_1_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_noodle.tut1` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(40);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:cooking_noodles_tut_2_start');
        player.camera.setCamera('noxcrew_kp:cooking_noodles_tut_2_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_noodle.tut2` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    RemoveEntityFamily(['tutorial_customer']);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:cooking_noodles_tut_3_start');
        player.camera.setCamera('noxcrew_kp:cooking_noodles_tut_3_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InCubic },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_noodle.tut3` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(40);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:cooking_noodles_tut_4_start');
        player.camera.setCamera('noxcrew_kp:cooking_noodles_tut_4_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_noodle.tut4` }] } },
        });
    }
    const boilingStations = world.getDimension('overworld').getEntities({ type: 'noxcrew.kp:boiling_station' });
    boilingStations.forEach(e => {
        e.triggerEvent('noxcrew:to.state.boiling');
    });
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(40);
    boilingStations.forEach(e => {
        e.triggerEvent('noxcrew:set.state.waiting');
    });
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:cooking_noodles_tut_5_start');
        player.camera.setCamera('noxcrew_kp:cooking_noodles_tut_5_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_noodle.tut5` }] } },
        });
    }
    const workStations = world.getDimension('overworld').getEntities({ type: 'noxcrew.kp:work_station' });
    workStations.forEach(e => {
        if (Math.floor(Math.random() * 2) == 0) {
            e.triggerEvent('noxcrew:set.item.pak_choi');
        }
        else {
            e.triggerEvent('noxcrew:set.item.daikon');
        }
        e.triggerEvent('noxcrew:to.chopping');
    });
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    workStations.forEach(e => {
        e.triggerEvent('noxcrew:set.item.none');
    });
    const tutorialNoodleCustomerWant = world
        .getDimension('overworld')
        .spawnEntity('noxcrew.kp:customer', { x: 0, y: 0, z: 0 });
    tutorialNoodleCustomerWant.teleport(stringToVector3('514 -52 2034'), { rotation: { y: 90, x: 0 } });
    tutorialNoodleCustomerWant.triggerEvent('noxcrew:spawn.peace');
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:cooking_noodles_tut_6_start');
        player.camera.setCamera('noxcrew_kp:cooking_noodles_tut_6_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_noodle.tut6` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    tutorialNoodleCustomerWant.triggerEvent('noxcrew:set.tutorial_customer');
    RemoveEntityFamily(['tutorial_customer']);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:cooking_noodles_tut_7_start');
        player.camera.setCamera('noxcrew_kp:cooking_noodles_tut_7_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_noodle.tut7` }] } },
        });
    }
    const serveStations = world.getDimension('overworld').getEntities({ type: 'noxcrew.kp:serving_station' });
    serveStations.forEach(e => {
        e.triggerEvent('noxcrew:set.item.noodle_bowl');
    });
    yield* delay(80);
    serveStations.forEach(e => {
        if (Math.floor(Math.random() * 2) == 0) {
            e.triggerEvent('noxcrew:set.item.noodle_bowl_pak_choi');
        }
        else {
            e.triggerEvent('noxcrew:set.item.noodle_bowl_daikon');
        }
    });
    yield* delay(100);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    loadTutorialNoodleCustomers();
    serveStations.forEach(e => {
        e.triggerEvent('noxcrew:set.item.none');
    });
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:cooking_noodles_tut_8_start');
        player.camera.setCamera('noxcrew_kp:cooking_noodles_tut_8_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_noodle.tut8` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    RemoveEntityFamily(['tutorial_customer']);
    const tutorialNoodleCustomerAngry = world
        .getDimension('overworld')
        .spawnEntity('noxcrew.kp:customer', { x: 0, y: 0, z: 0 });
    tutorialNoodleCustomerAngry.teleport(stringToVector3('514 -52 2038'), { rotation: { y: 90, x: 0 } });
    tutorialNoodleCustomerAngry.triggerEvent('noxcrew:spawn.peace');
    tutorialNoodleCustomerAngry.triggerEvent('noxcrew:set.emotion.angry');
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:cooking_noodles_tut_9_start');
        player.camera.setCamera('noxcrew_kp:cooking_noodles_tut_9_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_noodle.tut9` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    tutorialNoodleCustomerAngry.triggerEvent('noxcrew:set.tutorial_customer');
    RemoveEntityFamily(['tutorial_customer']);
    loadTutorialNoodleCustomers();
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:cooking_noodles_tut_10_start');
        player.camera.setCamera('noxcrew_kp:cooking_noodles_tut_10_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_noodle.tut10` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(endfade);
    yield* delay(40);
    RemoveEntityFamily(['tutorial_customer']);
    CookingActivity.cleanStations();
    for (const player of world.getPlayers(NOT_ADMIN)) {
        titleManager.addTitle({
            ...TITLES.letterbox_out,
            targets: new Set().add(player),
        });
        player.camera.clear();
    }
    yield* delay(20);
}
export function* seqTutorialDragonDance(titleManager) {
    const DRAGON_WOLF_LOCATIONS1 = [
        { location: { x: 2150, y: -37, z: 2222 } },
        { location: { x: 2154, y: -37, z: 2224 } },
        { location: { x: 2151, y: -37, z: 2229 } },
        { location: { x: 2147, y: -36, z: 2231 } },
    ];
    const DRAGON_WOLF_LOCATIONS2 = [
        { location: { x: 2225, y: -38, z: 2200 } },
        { location: { x: 2222, y: -38, z: 2209 } },
        { location: { x: 2226, y: -38, z: 2223 } },
        { location: { x: 2218, y: -38, z: 2224 } },
        { location: { x: 2226, y: -41, z: 2243 } },
        { location: { x: 2221, y: -42, z: 2251 } },
        { location: { x: 2231, y: -46, z: 2264 } },
        { location: { x: 2225, y: -46, z: 2279 } },
        { location: { x: 2227, y: -48, z: 2295 } },
        { location: { x: 2229, y: -49, z: 2306 } },
        { location: { x: 2222, y: -49, z: 2305 } },
        { location: { x: 2214, y: -49, z: 2305 } },
    ];
    function loadTutorialDragonWolves1() {
        for (const tutorialDragonWolves of DRAGON_WOLF_LOCATIONS1) {
            const tutorialDragonWolf = world
                .getDimension('overworld')
                .spawnEntity('noxcrew.kp:wolf_munchable', { x: 0, y: 0, z: 0 });
            tutorialDragonWolf.triggerEvent('noxcrew:set.tutorial_wolf_munchable');
            tutorialDragonWolf.teleport(tutorialDragonWolves.location);
        }
    }
    function loadTutorialDragonWolves2() {
        for (const tutorialDragonWolves of DRAGON_WOLF_LOCATIONS2) {
            const tutorialDragonWolf = world
                .getDimension('overworld')
                .spawnEntity('noxcrew.kp:wolf_munchable', { x: 0, y: 0, z: 0 });
            tutorialDragonWolf.triggerEvent('noxcrew:set.tutorial_wolf_munchable');
            tutorialDragonWolf.teleport(tutorialDragonWolves.location);
        }
    }
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.addEffect('invisibility', 20000000, { amplifier: 1, showParticles: false });
        player.runCommandAsync('inputpermission set @s movement disabled');
        player.teleport({ x: 2083, y: -33, z: 2213 });
    }
    const tutorialDragonSuit = world
        .getDimension('overworld')
        .spawnEntity('noxcrew.kp:dragondance_suit', { x: 0, y: 0, z: 0 });
    tutorialDragonSuit.teleport(stringToVector3('2102 -33 2230'), { rotation: { y: 90, x: 0 } });
    tutorialDragonSuit.triggerEvent('noxcrew:set.tutorial_dragondance_suit');
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        titleManager.addTitle({
            ...TITLES.letterbox_instant,
            targets: new Set().add(player),
        });
    }
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:dragon_dance_tut_1_start');
        player.camera.setCamera('noxcrew_kp:dragon_dance_tut_1_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_dragon_dance.tut1` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    RemoveEntityFamily(['tutorial_dragondance_suit']);
    const tutorialDragonSuit1 = world
        .getDimension('overworld')
        .spawnEntity('noxcrew.kp:dragondance_suit', { x: 0, y: 0, z: 0 });
    tutorialDragonSuit1.teleport(stringToVector3('2125 -33 2227'), { rotation: { y: -90, x: 0 } });
    tutorialDragonSuit1.triggerEvent('noxcrew:set.tutorial_dragondance_suit');
    loadTutorialDragonWolves1();
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:dragon_dance_tut_2_start');
        player.camera.setCamera('noxcrew_kp:dragon_dance_tut_2_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_dragon_dance.tut2` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    RemoveEntityFamily(['tutorial_wolf_munchable']);
    RemoveEntityFamily(['tutorial_dragondance_suit']);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.teleport({ x: 2173, y: -36, z: 2238 });
    }
    const tutorialDragonWolf = world
        .getDimension('overworld')
        .spawnEntity('noxcrew.kp:wolf_munchable', { x: 0, y: 0, z: 0 });
    tutorialDragonWolf.teleport(stringToVector3('2197 -38 2224'), { rotation: { y: 0, x: 0 } });
    tutorialDragonWolf.triggerEvent('noxcrew:set.tutorial_wolf_munchable');
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:dragon_dance_tut_3_start');
        player.camera.setCamera('noxcrew_kp:dragon_dance_tut_3_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_dragon_dance.tut3` }] } },
        });
    }
    yield* delay(120);
    const ghost = world.getDimension('overworld').spawnEntity('noxcrew.kp:spooky_ghost', { x: 0, y: 0, z: 0 });
    ghost.teleport(stringToVector3('2194 -38 2224'));
    tutorialDragonWolf.triggerEvent('noxcrew:set.scared.true');
    yield* delay(40);
    ghost.remove();
    tutorialDragonWolf.triggerEvent('noxcrew:set.knockout.true');
    yield* delay(20);
    tutorialDragonWolf.triggerEvent('noxcrew:set.tutorial_wolf_munchable');
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.teleport({ x: 2209, y: -38, z: 2247 });
    }
    RemoveEntityFamily(['tutorial_wolf_munchable']);
    loadTutorialDragonWolves2();
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:dragon_dance_tut_4_start');
        player.camera.setCamera('noxcrew_kp:dragon_dance_tut_4_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_dragon_dance.tut4` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    RemoveEntityFamily(['tutorial_wolf_munchable']);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:dragon_dance_tut_5_start');
        player.camera.setCamera('noxcrew_kp:dragon_dance_tut_5_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_dragon_dance.tut5` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(30);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.runCommandAsync('inputpermission set @s movement enabled');
        titleManager.addTitle({
            ...TITLES.letterbox_out,
            targets: new Set().add(player),
        });
        player.camera.clear();
    }
}
export function* seqTutorialTraining(titleManager) {
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.addEffect('invisibility', 20000000, { amplifier: 1, showParticles: false });
        player.runCommandAsync('inputpermission set @s movement disabled');
    }
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        titleManager.addTitle({
            ...TITLES.letterbox_instant,
            targets: new Set().add(player),
        });
    }
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:training_tut_1_start');
        player.camera.setCamera('noxcrew_kp:training_tut_1_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_training.tut1` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    const tutorialdummy = world.getDimension('overworld').spawnEntity('noxcrew.kp:target_dummies', { x: 0, y: 0, z: 0 });
    tutorialdummy.teleport(stringToVector3('527 -5 6043'), { rotation: { y: -60, x: 0 } });
    tutorialdummy.triggerEvent('noxcrew:set.tutorial_dummy');
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:training_tut_2_start');
        player.camera.setCamera('noxcrew_kp:training_tut_2_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_training.tut2` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    RemoveEntityFamily(['tutorial_dummy']);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:training_tut_3_start');
        player.camera.setCamera('noxcrew_kp:training_tut_3_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InOutSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_training.tut3` }] } },
        });
    }
    yield* delay(30);
    const tutorialdummy1 = world.getDimension('overworld').spawnEntity('noxcrew.kp:target_dummies', { x: 0, y: 0, z: 0 });
    tutorialdummy1.teleport(stringToVector3('507 -5 6047'), { rotation: { y: -90, x: 0 } });
    yield* delay(20);
    tutorialdummy1.kill();
    yield* delay(30);
    const tutorialdummy2 = world.getDimension('overworld').spawnEntity('noxcrew.kp:target_dummies', { x: 0, y: 0, z: 0 });
    tutorialdummy2.teleport(stringToVector3('507 -5 6052'), { rotation: { y: -90, x: 0 } });
    yield* delay(20);
    tutorialdummy2.kill();
    yield* delay(30);
    const tutorialdummy3 = world.getDimension('overworld').spawnEntity('noxcrew.kp:target_dummies', { x: 0, y: 0, z: 0 });
    tutorialdummy3.teleport(stringToVector3('507 -5 6057'), { rotation: { y: -90, x: 0 } });
    yield* delay(20);
    tutorialdummy3.kill();
    yield* delay(40);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(40);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:training_tut_4_start');
        player.camera.setCamera('noxcrew_kp:training_tut_4_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.Linear },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_training.tut4` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:training_tut_5_start');
        player.camera.setCamera('noxcrew_kp:training_tut_5_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.OutSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_training.tut5` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(endfade);
    yield* delay(40);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.runCommandAsync('inputpermission set @s movement enabled');
        titleManager.addTitle({
            ...TITLES.letterbox_out,
            targets: new Set().add(player),
        });
        player.camera.clear();
    }
    yield* delay(20);
}
export function* seqTutorialWolfGongmen(titleManager) {
    const GONGMEN_COLLECTOR_LOCATIONS = [
        { location: { x: 2130, y: -38, z: 4195 } },
        { location: { x: 2132, y: -38, z: 4181 } },
        { location: { x: 2130, y: -38, z: 4167 } },
        { location: { x: 2147, y: -38, z: 4172 } },
        { location: { x: 2142, y: -38, z: 4187 } },
        { location: { x: 2144, y: -38, z: 4198 } },
    ];
    const GONGMEN_WARRIOR_LOCATIONS = [
        { location: { x: 2147, y: -38, z: 4167 } },
        { location: { x: 2141, y: -38, z: 4165 } },
        { location: { x: 2136, y: -38, z: 4169 } },
        { location: { x: 2133, y: -38, z: 4162 } },
        { location: { x: 2134, y: -38, z: 4175 } },
        { location: { x: 2137, y: -38, z: 4180 } },
        { location: { x: 2144, y: -38, z: 4182 } },
        { location: { x: 2130, y: -38, z: 4189 } },
        { location: { x: 2134, y: -38, z: 4190 } },
        { location: { x: 2146, y: -38, z: 4190 } },
        { location: { x: 2140, y: -38, z: 4197 } },
        { location: { x: 2148, y: -38, z: 4203 } },
        { location: { x: 2119, y: -35, z: 4186 } },
        { location: { x: 2119, y: -35, z: 4179 } },
        { location: { x: 2119, y: -35, z: 4171 } },
    ];
    function loadTutorialGongmenCollectors() {
        for (const loadTutorialGongmenCollectors of GONGMEN_COLLECTOR_LOCATIONS) {
            const loadTutorialGongmenCollector = world
                .getDimension('overworld')
                .spawnEntity('noxcrew.kp:wolf_collector', { x: 0, y: 0, z: 0 });
            loadTutorialGongmenCollector.triggerEvent('noxcrew:set.tutorial_wolf_collector');
            loadTutorialGongmenCollector.teleport(loadTutorialGongmenCollectors.location);
        }
    }
    function loadTutorialGongmenWarriors() {
        for (const tutorialGongmenWarriors of GONGMEN_WARRIOR_LOCATIONS) {
            const tutorialGongmenWarrior = world
                .getDimension('overworld')
                .spawnEntity('noxcrew.kp:warrior_wolf', { x: 0, y: 0, z: 0 });
            tutorialGongmenWarrior.triggerEvent('noxcrew:set.tutorial_wolf_warrior');
            tutorialGongmenWarrior.teleport(tutorialGongmenWarriors.location);
        }
    }
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.addEffect('invisibility', 20000000, { amplifier: 1, showParticles: false });
        player.runCommandAsync('inputpermission set @s movement disabled');
        player.teleport({ x: 2155, y: -38, z: 4178 });
    }
    loadTutorialGongmenCollectors();
    loadTutorialGongmenWarriors();
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        titleManager.addTitle({
            ...TITLES.letterbox_instant,
            targets: new Set().add(player),
        });
    }
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:wolf_gongmen_tut_1_start');
        player.camera.setCamera('noxcrew_kp:wolf_gongmen_tut_1_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_wolf_gongmen.tut1` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    RemoveEntityFamily(['tutorial_wolf_collector']);
    RemoveEntityFamily(['tutorial_wolf_warrior']);
    const tutorialCollector = world
        .getDimension('overworld')
        .spawnEntity('noxcrew.kp:wolf_collector', { x: 0, y: 0, z: 0 });
    tutorialCollector.teleport(stringToVector3('2146 -38 4199'), { rotation: { y: 150, x: 0 } });
    tutorialCollector.triggerEvent('noxcrew:set.tutorial_wolf_collector');
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:wolf_gongmen_tut_2_start');
        player.camera.setCamera('noxcrew_kp:wolf_gongmen_tut_2_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_wolf_gongmen.tut2` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    RemoveEntityFamily(['tutorial_wolf_collector']);
    const tutorialCollector1 = world
        .getDimension('overworld')
        .spawnEntity('noxcrew.kp:wolf_collector', { x: 0, y: 0, z: 0 });
    tutorialCollector1.teleport(stringToVector3('2129 -38 4195'), { rotation: { y: -130, x: 0 } });
    tutorialCollector1.triggerEvent('noxcrew:set.tutorial_wolf_collector');
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:wolf_gongmen_tut_3_start');
        player.camera.setCamera('noxcrew_kp:wolf_gongmen_tut_3_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_wolf_gongmen.tut3` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    RemoveEntityFamily(['tutorial_wolf_collector']);
    const tutorialBossWolf = world.getDimension('overworld').spawnEntity('noxcrew.kp:boss_wolf', { x: 0, y: 0, z: 0 });
    tutorialBossWolf.teleport(stringToVector3('2119 -35 4179'), { rotation: { y: -90, x: 0 } });
    tutorialBossWolf.triggerEvent('noxcrew:set.tutorial_boss_wolf_gong');
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:wolf_gongmen_tut_4_start');
        player.camera.setCamera('noxcrew_kp:wolf_gongmen_tut_4_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_wolf_gongmen.tut4` }] } },
        });
    }
    yield* delay(90);
    tutorialBossWolf.playAnimation('animation.boss_wolf.arrow_call');
    const tutorialArrowVolley = world
        .getDimension('overworld')
        .spawnEntity('noxcrew.kp:arrow_flare', { x: 2122, y: -36, z: 4179 });
    tutorialArrowVolley.triggerEvent('noxcrew:set.tutorial_arrow_flare');
    yield* delay(90);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    RemoveEntityFamily(['tutorial_arrow_flare']);
    RemoveEntityFamily(['tutorial_boss_wolf']);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:wolf_gongmen_tut_5_start');
        player.camera.setCamera('noxcrew_kp:wolf_gongmen_tut_5_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_wolf_gongmen.tut5` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    loadTutorialGongmenCollectors();
    loadTutorialGongmenWarriors();
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:wolf_gongmen_tut_6_start');
        player.camera.setCamera('noxcrew_kp:wolf_gongmen_tut_6_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_wolf_gongmen.tut6` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(endfade);
    yield* delay(20);
    RemoveEntityFamily(['tutorial_wolf_collector']);
    RemoveEntityFamily(['tutorial_wolf_warrior']);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.runCommandAsync('inputpermission set @s movement enabled');
        titleManager.addTitle({
            ...TITLES.letterbox_out,
            targets: new Set().add(player),
        });
        player.camera.clear();
    }
    yield* delay(20);
}
export function* seqTutorialWolfPeace(titleManager) {
    const PEACE_COLLECTOR_LOCATIONS = [
        { location: { x: 547, y: -52, z: 4589 } },
        { location: { x: 536, y: -52, z: 4596 } },
        { location: { x: 545, y: -52, z: 4603 } },
        { location: { x: 523, y: -52, z: 4591 } },
        { location: { x: 518, y: -52, z: 4604 } },
        { location: { x: 510, y: -53, z: 4595 } },
    ];
    const PEACE_WARRIOR_LOCATIONS = [
        { location: { x: 544, y: -52, z: 4586 } },
        { location: { x: 547, y: -52, z: 4589 } },
        { location: { x: 543, y: -52, z: 4601 } },
        { location: { x: 547, y: -52, z: 4605 } },
        { location: { x: 538, y: -52, z: 4594 } },
        { location: { x: 534, y: -52, z: 4597 } },
        { location: { x: 523, y: -52, z: 4594 } },
        { location: { x: 524, y: -52, z: 4589 } },
        { location: { x: 518, y: -52, z: 4602 } },
        { location: { x: 516, y: -52, z: 4606 } },
        { location: { x: 513, y: -53, z: 4594 } },
        { location: { x: 508, y: -53, z: 4595 } },
    ];
    function loadTutorialPeaceCollectors() {
        for (const loadTutorialPeaceCollectors of PEACE_COLLECTOR_LOCATIONS) {
            const loadTutorialPeaceCollector = world
                .getDimension('overworld')
                .spawnEntity('noxcrew.kp:wolf_collector', { x: 0, y: 0, z: 0 });
            loadTutorialPeaceCollector.triggerEvent('noxcrew:set.tutorial_wolf_collector');
            loadTutorialPeaceCollector.teleport(loadTutorialPeaceCollectors.location);
        }
    }
    function loadTutorialPeaceWarriors() {
        for (const tutorialPeaceWarriors of PEACE_WARRIOR_LOCATIONS) {
            const tutorialPeaceWarrior = world
                .getDimension('overworld')
                .spawnEntity('noxcrew.kp:warrior_wolf', { x: 0, y: 0, z: 0 });
            tutorialPeaceWarrior.triggerEvent('noxcrew:set.tutorial_wolf_warrior');
            tutorialPeaceWarrior.teleport(tutorialPeaceWarriors.location);
        }
    }
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.addEffect('invisibility', 20000000, { amplifier: 1, showParticles: false });
        player.runCommandAsync('inputpermission set @s movement disabled');
    }
    loadTutorialPeaceCollectors();
    loadTutorialPeaceWarriors();
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        titleManager.addTitle({
            ...TITLES.letterbox_instant,
            targets: new Set().add(player),
        });
    }
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:wolf_peace_tut_1_start');
        player.camera.setCamera('noxcrew_kp:wolf_peace_tut_1_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_wolf_peace.tut1` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    RemoveEntityFamily(['tutorial_wolf_collector']);
    RemoveEntityFamily(['tutorial_wolf_warrior']);
    const tutorialCollector = world
        .getDimension('overworld')
        .spawnEntity('noxcrew.kp:wolf_collector', { x: 0, y: 0, z: 0 });
    tutorialCollector.teleport(stringToVector3('516 -52 4603'), { rotation: { y: 180, x: 0 } });
    tutorialCollector.triggerEvent('noxcrew:set.tutorial_wolf_collector');
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:wolf_peace_tut_2_start');
        player.camera.setCamera('noxcrew_kp:wolf_peace_tut_2_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_wolf_peace.tut2` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    RemoveEntityFamily(['tutorial_wolf_collector']);
    const tutorialCollector1 = world
        .getDimension('overworld')
        .spawnEntity('noxcrew.kp:wolf_collector', { x: 0, y: 0, z: 0 });
    tutorialCollector1.teleport(stringToVector3('534 -52 4590'), { rotation: { y: 0, x: 0 } });
    tutorialCollector1.triggerEvent('noxcrew:set.tutorial_wolf_collector');
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:wolf_peace_tut_3_start');
        player.camera.setCamera('noxcrew_kp:wolf_peace_tut_3_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_wolf_peace.tut3` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    RemoveEntityFamily(['tutorial_wolf_collector']);
    const tutorialBossWolf = world.getDimension('overworld').spawnEntity('noxcrew.kp:boss_wolf', { x: 0, y: 0, z: 0 });
    tutorialBossWolf.teleport(stringToVector3('502 -52 4594'), { rotation: { y: -90, x: 0 } });
    tutorialBossWolf.triggerEvent('noxcrew:set.tutorial_boss_wolf_peace');
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:wolf_peace_tut_4_start');
        player.camera.setCamera('noxcrew_kp:wolf_peace_tut_4_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_wolf_peace.tut4` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    RemoveEntityFamily(['tutorial_boss_wolf']);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:wolf_peace_tut_5_start');
        player.camera.setCamera('noxcrew_kp:wolf_peace_tut_5_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_wolf_peace.tut5` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    loadTutorialPeaceCollectors();
    loadTutorialPeaceWarriors();
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:wolf_peace_tut_6_start');
        player.camera.setCamera('noxcrew_kp:wolf_peace_tut_6_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_wolf_peace.tut6` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(endfade);
    yield* delay(20);
    RemoveEntityFamily(['tutorial_wolf_collector']);
    RemoveEntityFamily(['tutorial_wolf_warrior']);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.runCommandAsync('inputpermission set @s movement enabled');
        titleManager.addTitle({
            ...TITLES.letterbox_out,
            targets: new Set().add(player),
        });
        player.camera.clear();
    }
    yield* delay(20);
}
export function* seqTutorialKomodo(titleManager) {
    const KOMODO_WARRIOR_LOCATIONS = [
        { location: { x: 6260, y: 24, z: 2040 } },
        { location: { x: 6260, y: 24, z: 2035 } },
        { location: { x: 6265, y: 24, z: 2041 } },
        { location: { x: 6265, y: 24, z: 2038 } },
        { location: { x: 6263, y: 24, z: 2030 } },
        { location: { x: 6273, y: 24, z: 2033 } },
        { location: { x: 6277, y: 24, z: 2031 } },
        { location: { x: 6281, y: 24, z: 2026 } },
        { location: { x: 6280, y: 24, z: 2022 } },
        { location: { x: 6274, y: 24, z: 2024 } },
        { location: { x: 6264, y: 24, z: 2024 } },
        { location: { x: 6261, y: 24, z: 2021 } },
        { location: { x: 6256, y: 24, z: 2025 } },
        { location: { x: 6274, y: 24, z: 2013 } },
        { location: { x: 6262, y: 24, z: 2012 } },
        { location: { x: 6268, y: 24, z: 2008 } },
        { location: { x: 6262, y: 24, z: 2007 } },
    ];
    function loadTutorialKomodos() {
        for (const tutorialKomodos of KOMODO_WARRIOR_LOCATIONS) {
            const tutorialKomodo = world
                .getDimension('overworld')
                .spawnEntity('noxcrew.kp:komodo_warrior', { x: 0, y: 0, z: 0 });
            tutorialKomodo.triggerEvent('noxcrew:set.tutorial_komodo');
            tutorialKomodo.teleport(tutorialKomodos.location);
        }
    }
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.addEffect('invisibility', 20000000, { amplifier: 1, showParticles: false });
        player.runCommandAsync('inputpermission set @s movement disabled');
        player.teleport({ x: 6240, y: 24, z: 2024 });
    }
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        titleManager.addTitle({
            ...TITLES.letterbox_instant,
            targets: new Set().add(player),
        });
    }
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:komodo_tut_1_start');
        player.camera.setCamera('noxcrew_kp:komodo_tut_1_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_komodo.tut1` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    loadTutorialKomodos();
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:komodo_tut_2_start');
        player.camera.setCamera('noxcrew_kp:komodo_tut_2_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_komodo.tut2` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:komodo_tut_3_start');
        player.camera.setCamera('noxcrew_kp:komodo_tut_3_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_komodo.tut3` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    RemoveEntityFamily(['tutorial_komodo']);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:komodo_tut_4_start');
        player.camera.setCamera('noxcrew_kp:komodo_tut_4_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_komodo.tut4` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(quickfade);
    yield* delay(20);
    yield* delay(20);
    loadTutorialKomodos();
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.camera.setCamera('noxcrew_kp:komodo_tut_5_start');
        player.camera.setCamera('noxcrew_kp:komodo_tut_5_end', {
            easeOptions: { easeTime: 10, easeType: EasingType.InSine },
        });
        titleManager.addTitle({
            type: 'one-off',
            duration: 150,
            weight: 0,
            components: { actionbar: { rawtext: [{ translate: `txt.activity_komodo.tut5` }] } },
        });
    }
    yield* delay(180);
    for (const player of world.getPlayers(NOT_ADMIN))
        player.camera.fade(endfade);
    yield* delay(20);
    RemoveEntityFamily(['tutorial_komodo']);
    yield* delay(20);
    for (const player of world.getPlayers(NOT_ADMIN)) {
        player.runCommandAsync('inputpermission set @s movement enabled');
        titleManager.addTitle({
            ...TITLES.letterbox_out,
            targets: new Set().add(player),
        });
        player.camera.clear();
    }
    yield* delay(20);
}
