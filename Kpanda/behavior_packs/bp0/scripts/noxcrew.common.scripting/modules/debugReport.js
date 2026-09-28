import { Module } from "../api/index.js";
import { system, Player } from "@minecraft/server";
import { getBuildInfo } from "../api/util/buildInfo.js";
/**
 * Generates debug reports.
 *
 * When {@link EVENT_NAME} is received, a debug report is generated and {@link console.error}ed.
 */
export class DebugReportModule extends Module {
    /**
     * Creates a debug report.
     */
    async createReport() {
        const out = ['---'];
        const buildInfo = await getBuildInfo();
        if (buildInfo == null) {
            out.push('No build info');
        }
        else {
            out.push(buildInfo.buildConfiguration);
            out.push('Modules:');
            for (const [name, version] of Object.entries(buildInfo.modules)) {
                out.push(`${name} v${version}`);
            }
        }
        out.push('--');
        out.push('Loaded registerables:');
        this.pushRegisterable(this.container, out);
        out.push('---');
        return out.join('\n');
    }
    /**
     * Puts registerable names into {@link out}, recursively adding children if the registerable is also a {@link RegisterableHolder}.
     * @param registerable the registerable
     * @param out the output array
     * @param depth the current parent depth. Should be 0 when calling externally.
     */
    pushRegisterable(registerable, out, depth = 0) {
        out.push(`| `.repeat(depth) + `${registerable.constructor.name}`);
        if ('children' in registerable && registerable.children instanceof Set) {
            for (const child of registerable.children) {
                this.pushRegisterable(child, out, depth + 1);
            }
        }
    }
    setup() {
        this.listenFor(system.afterEvents.scriptEventReceive, e => {
            if (e.id != DebugReportModule.EVENT_NAME || e.initiator instanceof Player)
                return;
            this.createReport().then(console.error);
        });
    }
}
/** The event that triggers a debug report. */
DebugReportModule.EVENT_NAME = 'noxcrew.common.scripting:debug';
//# sourceMappingURL=debugReport.js.map