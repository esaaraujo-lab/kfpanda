import { Module } from "./module.js";
import { getBuildInfo } from "../util/buildInfo.js";
/**
 * A parent module for auto-loaded dependencies.
 */
export class AutoLoaderModule extends Module {
    constructor(container) {
        super(container);
    }
    setup() { }
    static async loadDependency(dependency) {
        return (await import(`${dependency}/__autoload.js`)).default;
    }
    /** Creates an {@link AutoLoaderModule} and auto-loads modules if needed. */
    static async createIfNeeded(entrypoint) {
        const buildInfo = await getBuildInfo();
        if (buildInfo == null || buildInfo.autoload.length == 0)
            return;
        const modules = [];
        await Promise.all(buildInfo.autoload.map(async (moduleName) => {
            try {
                const module = await this.loadDependency(moduleName);
                if (!(module instanceof Module)) {
                    throw new TypeError(`Default export was not a module`);
                }
                modules.push(module);
            }
            catch (e) {
                console.error(`Error while autoloading ${moduleName}:`, e);
            }
        }));
        if (modules.length == 0)
            return;
        const autoloadModule = new AutoLoaderModule(entrypoint);
        for (const child of modules) {
            autoloadModule.registerChild(child);
        }
        return autoloadModule;
    }
}
//# sourceMappingURL=autoload.js.map