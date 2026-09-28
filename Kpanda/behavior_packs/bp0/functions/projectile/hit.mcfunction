# This is for particle hit effects woooo

execute if entity @s[type=noxcrew.kp:projectile_fireworks] run function projectile/fireworks
execute unless entity @s[type=noxcrew.kp:projectile_fireworks] run function projectile/weapons

event entity @s noxcrew:despawn