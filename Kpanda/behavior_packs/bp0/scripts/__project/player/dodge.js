import { world } from "@minecraft/server";
import { DynamicProperty, TickingModule } from "noxcrew.common.scripting/index.js";
import ADMIN_TAG from "./disable.js";
export class PlayerDodgeManager extends TickingModule {
    constructor(container) {
        super(container, 1);
    }
    tick() {
        for (const player of world.getAllPlayers()) {
            if (player.hasTag(ADMIN_TAG))
                continue;
            const dodgeCooldown = PlayerDodgeManager.DODGE_STORAGE.get(player) ?? 0;
            if (dodgeCooldown == 0) {
                if (player.isSneaking) {
                    const rot = (player.getRotation().y + 90) * (Math.PI / 180);
                    const moveX = Math.cos(rot);
                    const moveZ = Math.sin(rot);
                    player.applyKnockback(moveX, moveZ, PlayerDodgeManager.DODGE_STRENGTH.x, PlayerDodgeManager.DODGE_STRENGTH.y);
                    player.triggerEvent('noxcrew:add.dodge_invincible');
                    PlayerDodgeManager.DODGE_STORAGE.set(player, PlayerDodgeManager.DODGE_COOLDOWN_TIME);
                }
            }
            else {
                if (dodgeCooldown == 1) {
                    player.triggerEvent('noxcrew:remove.dodge_invincible');
                    if (player.isOnGround && !player.isSneaking) {
                        PlayerDodgeManager.DODGE_STORAGE.set(player, 0);
                    }
                }
                else if (dodgeCooldown > 1) {
                    PlayerDodgeManager.DODGE_STORAGE.set(player, dodgeCooldown - 1);
                }
            }
        }
    }
}
PlayerDodgeManager.DODGE_STRENGTH = { x: 2, y: 0.3 };
PlayerDodgeManager.DODGE_COOLDOWN_TIME = 10;
PlayerDodgeManager.DODGE_STORAGE = new DynamicProperty('noxcrew.kp:dodge_cooldown');
