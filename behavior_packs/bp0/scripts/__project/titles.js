export const TITLES = {
    letterbox_in: {
        type: 'one-off',
        components: {
            title: { text: 'nox:letterbox_in' },
        },
        weight: 100,
        duration: 20,
        isUi: true,
    },
    letterbox_out: {
        type: 'one-off',
        components: {
            title: { text: 'nox:letterbox_out' },
        },
        weight: 110,
        duration: 1,
        isUi: true,
    },
    letterbox_instant: {
        type: 'one-off',
        components: {
            title: { text: 'nox:letterbox_instant' },
        },
        weight: 100,
        duration: 1,
        isUi: true,
    },
    letterbox_open: {
        type: 'one-off',
        components: {
            title: { text: 'nox:letterbox_open' },
        },
        weight: 100,
        duration: 1,
        isUi: true,
    },
    letterbox_brand: {
        type: 'one-off',
        components: {
            title: { text: 'nox:brand' },
        },
        weight: 200,
        duration: 1,
        isUi: true,
    },
    letterbox_academy: {
        type: 'one-off',
        components: {
            title: { text: 'nox:area_academy' },
        },
        weight: 100,
        duration: 1,
        isUi: true,
    },
    letterbox_stasis: {
        type: 'one-off',
        components: {
            title: { text: 'nox:letterbox_stasis' },
        },
        weight: 100,
        duration: 20,
        isUi: true,
    },
    letterbox_tutorial: {
        type: 'one-off',
        components: {
            title: { text: 'nox:letterbox_tutorial' },
        },
        weight: 100,
        duration: 20,
        isUi: true,
    },
    countdown3: createUiTrigger('nox:popup_countdown3', 100),
    countdown2: createUiTrigger('nox:popup_countdown2', 110),
    countdown1: createUiTrigger('nox:popup_countdown1', 120),
    countdown_go: createUiTrigger('nox:popup_go', 130),
    ping_incorrect: {
        type: 'one-off',
        components: {
            title: { text: 'nox:popup_ping1' },
        },
        weight: 100,
        duration: 20,
        isUi: true,
    },
    munchwolf1: {
        type: 'one-off',
        components: {
            title: { text: 'nox:popup_munchwolf1' },
        },
        weight: 100,
        duration: 20,
        isUi: true,
    },
    munchwolf2: {
        type: 'one-off',
        components: {
            title: { text: 'nox:popup_munchwolf2' },
        },
        weight: 100,
        duration: 20,
        isUi: true,
    },
    munchwolf3: {
        type: 'one-off',
        components: {
            title: { text: 'nox:popup_munchwolf3' },
        },
        weight: 100,
        duration: 20,
        isUi: true,
    },
    boss_title_tai: {
        type: 'one-off',
        components: {
            title: { text: 'nox:boss_title_tai' },
        },
        weight: 105,
        duration: 20,
        isUi: true,
    },
    boss_title_shen: {
        type: 'one-off',
        components: {
            title: { text: 'nox:boss_title_shen' },
        },
        weight: 105,
        duration: 20,
        isUi: true,
    },
    boss_title_kai: {
        type: 'one-off',
        components: {
            title: { text: 'nox:boss_title_kai' },
        },
        weight: 105,
        duration: 20,
        isUi: true,
    },
    boss_title_chameleon: {
        type: 'one-off',
        components: {
            title: { text: 'nox:boss_title_chameleon' },
        },
        weight: 105,
        duration: 20,
        isUi: true,
    },
    boss_in_tai: {
        type: 'one-off',
        components: {
            title: { text: 'nox:boss_in_tai' },
        },
        weight: 105,
        duration: 20,
        isUi: true,
    },
    boss_in_shen: {
        type: 'one-off',
        components: {
            title: { text: 'nox:boss_in_shen' },
        },
        weight: 105,
        duration: 20,
        isUi: true,
    },
    boss_in_kai: {
        type: 'one-off',
        components: {
            title: { text: 'nox:boss_in_kai' },
        },
        weight: 105,
        duration: 20,
        isUi: true,
    },
    boss_in_chameleon: {
        type: 'one-off',
        components: {
            title: { text: 'nox:boss_in_chameleon' },
        },
        weight: 105,
        duration: 20,
        isUi: true,
    },
    boss_out_tai: {
        type: 'one-off',
        components: {
            title: { text: 'nox:boss_out_tai' },
        },
        weight: 105,
        duration: 20,
        isUi: true,
    },
    boss_out_shen: {
        type: 'one-off',
        components: {
            title: { text: 'nox:boss_out_shen' },
        },
        weight: 105,
        duration: 20,
        isUi: true,
    },
    boss_out_kai: {
        type: 'one-off',
        components: {
            title: { text: 'nox:boss_out_kai' },
        },
        weight: 105,
        duration: 20,
        isUi: true,
    },
    boss_out_chameleon: {
        type: 'one-off',
        components: {
            title: { text: 'nox:boss_out_chameleon' },
        },
        weight: 105,
        duration: 20,
        isUi: true,
    },
    area_in_spirit_realm: {
        type: 'one-off',
        components: {
            title: { text: 'nox:area_in_spirit_realm' },
        },
        weight: 105,
        duration: 20,
        isUi: true,
    },
};
export function createUiTrigger(name, weight = 100) {
    return {
        type: 'one-off',
        components: {
            title: { text: name },
        },
        weight: weight,
        duration: 1,
        isUi: true,
    };
}
