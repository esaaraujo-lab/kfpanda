## Called by 2 entities:
### 	behavior_packs\N-KP-BP\entities\character\vip_npc\goose_palace_guard.json
###		behavior_packs\N-KP-BP\entities\character\vip_npc\pig_palace_guard.json
## Runs when they spawn, and when their dialogue window is closed.
## Randomly reassigns their dialogue to another scene in the same dialogue file: behavior_packs\N-KP-BP\dialogue\palace_guard_dialogues.json

scoreboard players random @s var 1 8

execute if score @s var matches 1 run dialogue change @s noxcrew.kp:character.palace.guard1
execute if score @s var matches 2 run dialogue change @s noxcrew.kp:character.palace.guard2
execute if score @s var matches 3 run dialogue change @s noxcrew.kp:character.palace.guard3
execute if score @s var matches 4 run dialogue change @s noxcrew.kp:character.palace.guard4
execute if score @s var matches 5 run dialogue change @s noxcrew.kp:character.palace.guard5
execute if score @s var matches 6 run dialogue change @s noxcrew.kp:character.palace.guard6
execute if score @s var matches 7 run dialogue change @s noxcrew.kp:character.palace.guard7
execute if score @s var matches 8 run dialogue change @s noxcrew.kp:character.palace.guard8