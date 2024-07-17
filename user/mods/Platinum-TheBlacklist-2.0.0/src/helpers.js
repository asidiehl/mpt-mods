"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBulletOrShotgunShell = void 0;
function isBulletOrShotgunShell(item) {
    const props = item._props;
    return props.ammoType === "bullet" || props.ammoType === "buckshot";
}
exports.isBulletOrShotgunShell = isBulletOrShotgunShell;
//# sourceMappingURL=helpers.js.map