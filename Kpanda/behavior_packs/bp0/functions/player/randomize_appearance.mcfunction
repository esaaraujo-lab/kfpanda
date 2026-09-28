#> Randomizes the players body type, clothing, and accessories, AND updates their outfit change screen as well.
#> Called by: "behavior_packs\N-KP-BP\dialogue\character_select.json"
#> Run by the player, with their outfit_change as "this.outfit_change"

scoreboard players random @s char.bodytype 0 2
scoreboard players random @s char.clothing 0 4
scoreboard players random @s char.accessory 0 4

execute as @s if score @s char.bodytype matches 0 run function player/body/0
execute as @s if score @s char.bodytype matches 1 run function player/body/1
execute as @s if score @s char.bodytype matches 2 run function player/body/2

execute as @s if score @s char.clothing matches 0 run function player/clothing/0
execute as @s if score @s char.clothing matches 1 run function player/clothing/1
execute as @s if score @s char.clothing matches 2 run function player/clothing/2
execute as @s if score @s char.clothing matches 3 run function player/clothing/3
execute as @s if score @s char.clothing matches 4 run function player/clothing/4

execute as @s if score @s char.accessory matches 0 run function player/accessory/0
execute as @s if score @s char.accessory matches 1 run function player/accessory/1
execute as @s if score @s char.accessory matches 2 run function player/accessory/2
execute as @s if score @s char.accessory matches 3 run function player/accessory/3
execute as @s if score @s char.accessory matches 4 run function player/accessory/4