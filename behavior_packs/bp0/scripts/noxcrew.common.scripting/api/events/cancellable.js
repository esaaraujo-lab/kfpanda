import { EventDispatcher } from "./dispatcher.js";
/**
 * An event dispatcher that will stop if the event is cancelled by a handler.
 * Each handler is called in registration order, earliest first.
 */
export class CancellableEventDispatcher extends EventDispatcher {
    /**
     * Dispatches the event.
     * @param event the event
     * @return whether the event was cancelled
     */
    dispatch(event) {
        for (const listener of this.listeners) {
            try {
                listener(event);
            }
            catch (e) {
                console.error(`Caught exception in event handler: ${e}`);
            }
            if (event.isCancelled)
                break;
        }
        return event.isCancelled;
    }
}
//# sourceMappingURL=cancellable.js.map