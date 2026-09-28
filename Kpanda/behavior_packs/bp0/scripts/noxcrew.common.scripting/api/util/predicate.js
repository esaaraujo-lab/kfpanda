/** A predicate that returns true if all of {@link predicates} also return true. */
export function allOf(...predicates) {
    return it => predicates.every(it2 => it2(it));
}
/** A predicate that returns true if at least one of {@link predicates} also return true. */
export function anyOf(...predicates) {
    return it => predicates.some(it2 => it2(it));
}
/** A predicate that returns true exactly none of {@link predicates} return true. */
export function noneOf(...predicates) {
    return it => predicates.every(it2 => !it2(it));
}
//# sourceMappingURL=predicate.js.map