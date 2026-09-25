var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Container_instances, _Container_throw;
/**
 * An error while binding or injecting a dependency.
 */
export class InjectionError extends Error {
    /**
     * @param property The type that was being bound to or injected.
     * @param message The error message.
     */
    constructor(property, message) {
        super(message != null ? `${property.name}: ${message}` : property.name);
        this.property = property;
    }
}
/** The field set on prototypes indicating subclasses should be bound. */
const BIND_SUBCLASSES_KEY = '__noxcrew_bind_subclasses';
/**
 * A dependency container that allows binding and retrieval of objects by type.
 * Types are represented by their constructor functions.
 */
export class Container {
    constructor() {
        _Container_instances.add(this);
        this.types = new Map();
    }
    static bindableTypes(type) {
        const out = [];
        let _proto = type.prototype;
        do {
            const ctor = _proto.constructor;
            if (ctor === type || ctor.hasOwnProperty(BIND_SUBCLASSES_KEY)) {
                out.push(ctor);
            }
            _proto = ctor.prototype ? Object.getPrototypeOf(ctor.prototype) : undefined;
        } while (_proto != undefined);
        return out;
    }
    /**
     * Binds an instance to a type.
     * @param instance the instance to bind
     * @param type the constructor of the type to bind, or the instance's own constructor by default
     * @throws InjectionError if an instance has already been bound for the type
     */
    bind(instance, type = instance.constructor) {
        const typesToBind = Container.bindableTypes(type);
        for (const typeToBind of typesToBind) {
            if (this.types.has(typeToBind)) {
                throw new InjectionError(typeToBind, `Attempted re-registration`);
            }
            this.types.set(typeToBind, instance);
        }
    }
    /**
     * Unbinds a given type's bound instance, ignoring {@link BindSubclasses}-marked superclasse.
     * @param type the constructor of the type to unbind
     * @return true if the type had a bound instance which has been removed, false otherwise
     */
    unbindForType(type) {
        return this.types.delete(type);
    }
    /**
     * Unbinds an instance from a type, as well as any {@link BindSubclasses}-marked superclasses it's also bound to.
     * @param instance the instance to unbind
     * @param type the type to unbind from. Defaults to the instance's own constructor
     * @return true if the instance was bound to the type and was unbound, false otherwise
     */
    unbind(instance, type = instance.constructor) {
        let hasRemovedAType = false;
        for (const typeToUnbind of Container.bindableTypes(type)) {
            if (this.types.get(typeToUnbind) === instance) {
                this.types.delete(typeToUnbind);
                hasRemovedAType = true;
            }
        }
        return hasRemovedAType;
    }
    /**
     * Eagerly fetches a type's bound instance.
     * @param type the type of object to get
     * @return the instance, or undefined if nothing is bound
     */
    getOrNull(type) {
        return this.types.get(type);
    }
    /**
     * Eagerly fetches a type's bound instance, throwing an {@link InjectionError} if nothing is bound.
     * @param type the type of object to get
     * @return the instance
     * @throws InjectionError if there's nothing bound to the type
     */
    get(type) {
        return this.getOrNull(type) ?? __classPrivateFieldGet(this, _Container_instances, "m", _Container_throw).call(this, type);
    }
    inject(type, nullable = false) {
        const realValue = () => (nullable ? this.getOrNull(type) : this.get(type));
        return new Proxy({}, {
            set(target, p, newValue, receiver) {
                const value = realValue();
                if (value === undefined)
                    return false;
                return Reflect.set(value, p, newValue, receiver);
            },
            get(target, p, receiver) {
                const value = realValue();
                if (value === undefined)
                    return undefined;
                const val = Reflect.get(value, p, receiver);
                return typeof val === 'function' ? val.bind(realValue()) : val;
            },
        });
    }
}
_Container_instances = new WeakSet(), _Container_throw = function _Container_throw(key) {
    throw new InjectionError(key, `Attempted to inject unbound type`);
};
export function Inject(constructor, nullable = false) {
    return function (prop, context) {
        return {
            get() {
                return this.container[nullable ? 'getOrNull' : 'get'](constructor);
            },
            set() {
                throw new InjectionError(constructor, `Attempted to set injected field ${String(context.name)}`);
            },
        };
    };
}
/** Automatically binds subclass instances to this class' constructor when bound to its own. */
export function BindSubclasses(clazz, context) {
    clazz.prototype.constructor[BIND_SUBCLASSES_KEY] = true;
    return clazz;
}
//# sourceMappingURL=container.js.map