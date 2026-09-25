/**
 * Ensures only a single function can be running at a time.
 */
export class Mutex {
    constructor() {
        this._isLocked = false;
    }
    /** Whether the mutex is locked. */
    get isLocked() {
        return this._isLocked;
    }
    /**
     * Attempts to lock the mutex.
     * @return true if the mutex is now locked, false if already locked by something else
     */
    attemptLock() {
        if (this.isLocked)
            return false;
        this._isLocked = true;
        return true;
    }
    /**
     * Unlocks the mutex. Does nothing if the mutex is already unlocked.
     */
    unlock() {
        this._isLocked = false;
    }
    /**
     * Attempts to run a function if the mutex is not locked.
     * @param fn the function to run
     * @return the return value of {@link fn} if not locked, or {@code undefined} if locked
     */
    tryLocked(fn) {
        if (this.attemptLock()) {
            try {
                return fn();
            }
            finally {
                this.unlock();
            }
        }
        return undefined;
    }
}
//# sourceMappingURL=mutex.js.map