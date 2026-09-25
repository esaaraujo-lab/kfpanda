#> Sets the player's body type to 2, AND updates their outfit change screen as well.
#> Called by: "behavior_packs\N-KP-BP\dialogue\character_select.json"
#> Run by the player, with their outfit_change as "this.outfit_change"


scoreboard players set @s char.bodytype 2
event entity @s noxcrew:set.bodytype.2
event entity @e[type=noxcrew.kp:outfit_change,tag=this.outfit_change] noxcrew:set.bodytype.2