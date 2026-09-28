#> Tells the player they've entered Creative Mode, and they're supposed to be in Adventure Mode
#> Runs once per player if/when they enter Creative Mode.
#> Called from: behavior_packs\N-KP-BP\functions\maintick.mcfunction
#! The call may need to change, and probably should.

tag @s add creativeCheck
playsound gamemode_changed @s
tellraw @s {"rawtext": [{"translate" : "txt.res.msg1"}]}
tellraw @s {"rawtext": [{"translate" : "txt.res.msg4"}]}
tellraw @s {"rawtext": [{"translate" : "txt.res.msg2"}]}