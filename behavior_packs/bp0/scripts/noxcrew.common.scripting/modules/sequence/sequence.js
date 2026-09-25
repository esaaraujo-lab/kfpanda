/** Yields a set amount of ticks, delaying the sequence. */
export function* delay(ticks) {
    for (let i = 0; i < ticks; i++) {
        yield undefined;
    }
}
//# sourceMappingURL=sequence.js.map