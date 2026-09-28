import { Module } from "noxcrew.common.scripting/index.js";
import { CameraCreator } from "./tools/index.js";
/** This module will be automatically loaded when the server starts.  */
export class DevToolsAutoLoad extends Module {
    setup() {
        this.registerChild(new CameraCreator(this.container));
    }
}
//# sourceMappingURL=__autoload.js.map