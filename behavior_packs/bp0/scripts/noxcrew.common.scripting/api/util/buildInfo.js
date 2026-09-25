let buildInfo;
/**
 * Safely loads and fetches the project's build information.
 * Build info files are included with CT 0.19 and higher.
 * This method's returned promise will resolve to null when built with a lower version.
 */
export async function getBuildInfo() {
    if (buildInfo == null)
        buildInfo = import(/*webpackIgnore: true*/ 'noxcrew.creative-toolbox.buildinfo').then(r => r.default).catch(() => null);
    return await buildInfo;
}
//# sourceMappingURL=buildInfo.js.map