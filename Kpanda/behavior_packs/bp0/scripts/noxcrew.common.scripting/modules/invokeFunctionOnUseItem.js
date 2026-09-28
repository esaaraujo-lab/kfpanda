import { world } from "@minecraft/server";
import { SingleEventCallback } from "./singleEventCallback.js";
/**
 * Callback for when an item with a given type is used.
 * @deprecated replace with {@link SingleEventCallback}
 */
export class InvokeFunctionOnUseItem extends SingleEventCallback {
    constructor(container, callback, item) {
        super(container, world.afterEvents.itemUse, e => {
            const { source, itemStack } = e;
            if (itemStack.typeId != item)
                return;
            callback(source);
        });
    }
}
//# sourceMappingURL=invokeFunctionOnUseItem.js.map