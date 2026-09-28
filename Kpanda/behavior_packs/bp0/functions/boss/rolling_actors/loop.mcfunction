# Common Movement Functions
# Ran as:
#> noxcrew.kp:fiery_cage
#> noxcrew.kp:roll_panda
# Called from :
#> behavior_packs\N-KP-BP\functions\boss\kai\rolling_panda\loop.mcfunction
#> behavior_packs\N-KP-BP\functions\boss\chameleon\cage\loop.mcfunction

tag @s remove falling

# 'Gravity'
execute at @s if block  ~ ~-0.1 ~ air run function boss/rolling_actors/fall

tp @s[tag=!falling] ^ ^ ^0.25 true