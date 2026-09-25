## Summons all the entites for the map
## Called from:
# "functions/INIT"

# Summons the Marketing Assets
function INIT/summons/marketing

execute positioned ~ ~10 ~ run function INIT/summons/collectables
function INIT/summons/collectables_podiums
function INIT/summons/statues
function INIT/summons/npcs
function INIT/summons/scrolls
function INIT/summons/props
function INIT/summons/activities
function INIT/summons/outfit_screen
function INIT/summons/leeda_traps