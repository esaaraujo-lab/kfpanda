##! TODO JOE: Replace the dialogue commands (and the comment referencing it) once Andrej has produced the new files.
## Called by:
### 	behavior_packs\N-KP-BP\entities\character\npc\academy_student.json
## Runs when they spawn, and when their dialogue window is closed.
## Randomly reassigns their dialogue to another scene in the same dialogue file: behavior_packs\N-KP-BP\dialogue\student_dialogues.json

scoreboard players random @s var 1 8

execute if score @s var matches 1 run dialogue change @s noxcrew.kp:character.student1
execute if score @s var matches 2 run dialogue change @s noxcrew.kp:character.student2
execute if score @s var matches 3 run dialogue change @s noxcrew.kp:character.student3
execute if score @s var matches 4 run dialogue change @s noxcrew.kp:character.student4
execute if score @s var matches 5 run dialogue change @s noxcrew.kp:character.student5
execute if score @s var matches 6 run dialogue change @s noxcrew.kp:character.student6
execute if score @s var matches 7 run dialogue change @s noxcrew.kp:character.student7
execute if score @s var matches 8 run dialogue change @s noxcrew.kp:character.student8