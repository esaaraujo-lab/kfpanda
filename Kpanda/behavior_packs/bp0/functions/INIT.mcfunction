## Setup for the map that should be run before release.
## Pure utility function, should not be called anywhere in the project
## Ran From "Command Block" in the spawn room

# Run init functions ordered by priority
function INIT/gamerules
function INIT/scoreboard
function INIT/summons

# Set World Spawn and Player Spawnpoint
setworldspawn -3998 228 74
spawnpoint @a -3998 228 74


# Run other systems for the map
tickingarea add circle 0 0 0 3 MainTick true

summon noxcrew.kp:start_button

# Remove INIT setup
fill ~ ~ ~ ~ ~-1 ~-1 air

tag @a remove creativeCheck