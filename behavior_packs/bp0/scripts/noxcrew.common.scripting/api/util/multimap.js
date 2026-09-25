// todo: this is copypasted from toolbox
/**
 * A map that can contain multiple values per key.
 * @template TKey the key type
 * @template TVal the type of a single value
 * @extends {Map<TKey, TVal[]>}
 */
export class Multimap extends Map {
    /**
     * Adds a value to a key. If the key doesn't exist, it is created.
     * @param {TKey} key the key to add the value to
     * @param {TVal} value the value to add
     * @returns {Multimap<TKey, TVal>} the Multimap instance
     */
    add(key, value) {
        let array = this.get(key);
        if (!array) {
            array = [];
            super.set(key, array);
        }
        array.push(value);
        return this;
    }
    /**
     * Adds all values from the provided array to a key. If the key doesn't exist, it is created.
     * @param {TKey} key the key to add the values to
     * @param {TVal[]} val the array of values to add
     * @returns {Multimap<TKey, TVal>} The Multimap instance
     */
    addAll(key, val) {
        const existing = this.get(key);
        if (existing == null) {
            this.set(key, val);
            return this;
        }
        existing.push(...val);
        return this;
    }
    /**
     * Removes a value from every element array.
     * @param value the value to remove
     * @return a set of the keys that the element was removed from
     */
    removeValue(value) {
        const keys = new Set();
        for (const [key, array] of this) {
            for (let idx = array.indexOf(value); idx != -1; idx = array.indexOf(value)) {
                keys.add(key);
                array.splice(idx, 1);
            }
        }
        return keys;
    }
}
//# sourceMappingURL=multimap.js.map