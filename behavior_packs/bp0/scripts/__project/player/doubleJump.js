import { world } from "@minecraft/server";
import { DynamicProperty, TickingModule } from "noxcrew.common.scripting/index.js";
import ADMIN_TAG from "./disable.js";
var JumpState;
(function (JumpState) {
    JumpState[JumpState["GROUNDED"] = 0] = "GROUNDED";
    JumpState[JumpState["FIRST_JUMP"] = 1] = "FIRST_JUMP";
    JumpState[JumpState["SECOND_JUMP_CHECK"] = 2] = "SECOND_JUMP_CHECK";
    JumpState[JumpState["SECOND_JUMP"] = 3] = "SECOND_JUMP";
})(JumpState || (JumpState = {}));
export class PlayerDoubleJumpManager extends TickingModule {
    constructor(container) {
        super(container, 1);
    }
    tick() {
        for (const player of world.getAllPlayers()) {
            if (player.hasTag(ADMIN_TAG))
                continue;
            const playerJumpState = PlayerDoubleJumpManager.JUMP_STORAGE.get(player) ?? 0;
            if (!player.isOnGround) {
                switch (playerJumpState) {
                    case JumpState.GROUNDED:
                        PlayerDoubleJumpManager.JUMP_STORAGE.set(player, JumpState.FIRST_JUMP);
                        break;
                    case JumpState.FIRST_JUMP:
                        if (!player.isJumping) {
                            PlayerDoubleJumpManager.JUMP_STORAGE.set(player, JumpState.SECOND_JUMP_CHECK);
                        }
                        break;
                    case JumpState.SECOND_JUMP_CHECK:
                        if (player.isJumping) {
                            PlayerDoubleJumpManager.JUMP_STORAGE.set(player, JumpState.SECOND_JUMP);
                            player.applyKnockback(0, 0, 0, PlayerDoubleJumpManager.JUMP_STRENGTH);
                            player.triggerEvent('noxcrew:add.double_jump');
                        }
                        break;
                }
            }
            else {
                if (playerJumpState != JumpState.GROUNDED) {
                    PlayerDoubleJumpManager.JUMP_STORAGE.set(player, JumpState.GROUNDED);
                }
            }
        }
    }
}
PlayerDoubleJumpManager.JUMP_STRENGTH = 0.65;
PlayerDoubleJumpManager.JUMP_STORAGE = new DynamicProperty('noxcrew.kp:jumpState');
