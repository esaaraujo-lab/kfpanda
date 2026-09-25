/**
 * A wrapper around a property, constraining it to a specific type.
 * @deprecated Prefer using property keys through the `property` function.
 */
export class DynamicProperty {
    constructor(identifier) {
        this.identifier = identifier;
    }
    /**
     * Gets the property's value for an entity.
     * @param target the entity or world to get the value for
     * @return the property's value, or `undefined` if not set
     */
    get(target) {
        return target.getDynamicProperty(this.identifier);
    }
    /**
     * Sets a property's value for an entity.
     * If {@link value} is nullish, clears the property instead of setting it.
     * @param target the entity or world to get the value for
     * @param value the new value for the property
     */
    set(target, value) {
        target.setDynamicProperty(this.identifier, value);
    }
}
//# sourceMappingURL=dynamicProperty.js.map