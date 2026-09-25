/**
 * A wrapper around a property, constraining it to a specific type.
 * @deprecated Prefer using property keys through the `property` function.
 */
export class Property {
    constructor(identifier) {
        this.identifier = identifier;
    }
    /**
     * Gets the property's value for an entity.
     * @param entity the entity to get the value for
     * @return the property's value, or `undefined` if not set
     */
    get(entity) {
        return entity.getProperty(this.identifier);
    }
    /**
     * Sets a property's value for an entity.
     * If {@link value} is nullish, clears the property instead of setting it.
     * @param entity the entity to set the value for
     * @param value the new value for the property
     */
    set(entity, value) {
        if (value == null) {
            entity.resetProperty(this.identifier);
        }
        else {
            entity.setProperty(this.identifier, value);
        }
    }
}
//# sourceMappingURL=property.js.map