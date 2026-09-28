#> Takes the current player's scores and applies it to the noxcrew.kp:outfit_change entity they're using.
#> Called by: "behavior_packs\N-KP-BP\dialogue\character_select.json"
#> Run by the player, with their outfit_change as "this.outfit_change"

scoreboard players add @s char.bodytype 0
scoreboard players add @s char.clothing 0
scoreboard players add @s char.accessory 0

execute if score @s char.bodytype matches 0 run event entity @e[type=noxcrew.kp:outfit_change,tag=this.outfit_change] noxcrew:set.bodytype.0
execute if score @s char.bodytype matches 1 run event entity @e[type=noxcrew.kp:outfit_change,tag=this.outfit_change] noxcrew:set.bodytype.1
execute if score @s char.bodytype matches 2 run event entity @e[type=noxcrew.kp:outfit_change,tag=this.outfit_change] noxcrew:set.bodytype.2

execute if score @s char.clothing matches 0 run event entity @e[type=noxcrew.kp:outfit_change,tag=this.outfit_change] noxcrew:set.clothing.0
execute if score @s char.clothing matches 1 run event entity @e[type=noxcrew.kp:outfit_change,tag=this.outfit_change] noxcrew:set.clothing.1
execute if score @s char.clothing matches 2 run event entity @e[type=noxcrew.kp:outfit_change,tag=this.outfit_change] noxcrew:set.clothing.2
execute if score @s char.clothing matches 3 run event entity @e[type=noxcrew.kp:outfit_change,tag=this.outfit_change] noxcrew:set.clothing.3
execute if score @s char.clothing matches 4 run event entity @e[type=noxcrew.kp:outfit_change,tag=this.outfit_change] noxcrew:set.clothing.4

execute if score @s char.accessory matches 0 run event entity @e[type=noxcrew.kp:outfit_change,tag=this.outfit_change] noxcrew:set.accessory.0
execute if score @s char.accessory matches 1 run event entity @e[type=noxcrew.kp:outfit_change,tag=this.outfit_change] noxcrew:set.accessory.1
execute if score @s char.accessory matches 2 run event entity @e[type=noxcrew.kp:outfit_change,tag=this.outfit_change] noxcrew:set.accessory.2
execute if score @s char.accessory matches 3 run event entity @e[type=noxcrew.kp:outfit_change,tag=this.outfit_change] noxcrew:set.accessory.3
execute if score @s char.accessory matches 4 run event entity @e[type=noxcrew.kp:outfit_change,tag=this.outfit_change] noxcrew:set.accessory.4