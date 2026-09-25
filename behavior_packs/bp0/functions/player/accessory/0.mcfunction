#> Sets the player's accessory to 0, AND updates their outfit change screen as well.
#> Called by: "behavior_packs\N-KP-BP\dialogue\character_select.json"
#> Run by the player, with their outfit_change as "this.outfit_change"


scoreboard players set @s char.accessory 0
event entity @s noxcrew:set.accessory.0
event entity @e[type=noxcrew.kp:outfit_change,tag=this.outfit_change] noxcrew:set.accessory.0