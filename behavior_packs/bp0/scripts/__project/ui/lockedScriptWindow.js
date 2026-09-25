import { Mutex } from "noxcrew.common.scripting/index.js";
const mutex = new Mutex();
export function tryOpenScriptWindow(form, player) {
    if (!mutex.attemptLock()) {
        player.onScreenDisplay.setActionBar({ translate: 'txt.error.msg6' });
        return undefined;
    }
    try {
        return form.show(player);
    }
    finally {
        mutex.unlock();
    }
}
