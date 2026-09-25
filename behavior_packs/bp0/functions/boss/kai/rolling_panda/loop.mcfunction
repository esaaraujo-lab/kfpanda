# Move bnt cart
# Ran as noxcrew.kp:bnt_cart
# Called from animation.bnt_cart_movement
function boss/rolling_actors/loop

execute positioned 4081 127 6101 if entity @s[r=2] run event entity @s noxcrew:despawn