import { Container } from "../di/container.js";
import { AutoLoaderModule } from "./autoload.js";
import { DebugReportModule } from "../../modules/debugReport.js";
/**
 * The main entrypoint for a script.
 */
export class Entrypoint extends Container {
    constructor() {
        super();
        this.modules = new Set();
        this.hasBeenStarted = false;
    }
    get children() {
        return this.modules;
    }
    /**
     * Registers a module. It will be loaded when the entrypoint is launched.
     * @param module the module to register
     */
    register(module) {
        if (module.isActive)
            throw new Error(`Cannot register already active module ${module.constructor.name}!`);
        this.modules.add(module);
        if (this.hasBeenStarted)
            module.activate();
    }
    /**
     * Binds and registers a module.
     * @see Container.bind
     * @see register
     */
    bindAndRegister(module) {
        this.bind(module);
        this.register(module);
    }
    /**
     * Unregisters a module.
     */
    unregister(module) {
        if (!this.modules.delete(module))
            return;
        if (module.isActive)
            module.deactivate();
    }
    /**
     * Launches an entrypoint.
     * @param initFn an init function to bind and register modules with
     */
    static async launch(initFn) {
        const entrypoint = new Entrypoint();
        await initFn.call(entrypoint);
        const autoloader = await AutoLoaderModule.createIfNeeded(entrypoint);
        if (autoloader != null)
            entrypoint.register(autoloader);
        entrypoint.register(new DebugReportModule(entrypoint));
        for (const module of entrypoint.modules) {
            module.activate();
        }
        entrypoint.hasBeenStarted = true;
        return entrypoint;
    }
}
//# sourceMappingURL=entrypoint.js.map