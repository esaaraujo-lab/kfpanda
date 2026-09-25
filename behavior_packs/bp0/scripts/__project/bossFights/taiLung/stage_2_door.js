import { world } from "@minecraft/server";
import { delay } from "noxcrew.common.scripting/index.js";
const LOCATION = '217 55 8042';
const FRAMES = {
    door2_1: 2,
    door2_2: 2,
    door2_3: 2,
    door2_4: 2,
    door2_5: 2,
    door2_6: 2,
};
export function* seqTaiLungStage2Door() {
    for (const [frame, time] of Object.entries(FRAMES)) {
        world.getDimension('overworld').runCommandAsync(`structure load noxcrew:${frame} ${LOCATION}`);
        yield* delay(time);
    }
}
