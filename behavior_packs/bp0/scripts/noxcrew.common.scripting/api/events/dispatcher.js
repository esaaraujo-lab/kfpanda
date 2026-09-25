/**
 * A dispatcher for a custom event.
 * Each handler is invoked in order of registration, earliest first.
 * @param T the event type
 */
export class EventDispatcher {
    constructor() {
        /**
         * Subscribed event handlers.
         *
         * TODO(lucy): there's potential for memory leaks here. Ideally I'd use a
         *  weak set but they're not iterable, and I'm not sure if we have WeakRefs here.
         */
        this.listeners = [];
    }
    subscribe(callback) {
        this.listeners.push(callback);
        return callback;
    }
    unsubscribe(callback) {
        const index = this.listeners.indexOf(callback);
        if (index == -1)
            return;
        this.listeners.splice(index, 1);
    }
    /**
     * Dispatches an event.
     * @param event the event
     */
    dispatch(event) {
        for (const listener of this.listeners) {
            try {
                listener(event);
            }
            catch (e) {
                console.error(`Caught exception in event handler: ${e}`);
            }
        }
    }
}
//# sourceMappingURL=dispatcher.js.map