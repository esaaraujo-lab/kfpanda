## Create and initialize all scoreboard objectives used in the map
## Called from:
# "functions/INIT"

#!	Objective Creation

# Primary storage data
scoreboard objectives add var dummy
# First Join Setup scoreboard
scoreboard objectives add first_join dummy

# Player location
scoreboard objectives add p.loc dummy
scoreboard objectives add p.loc.old dummy

# Dodge Cooldown and Jump State - replace when dynamic properies are out
scoreboard objectives add dodge_cooldown dummy
scoreboard objectives add jump_state dummy

# Storage for cooking data for easy inspection
scoreboard objectives add activity.cooking dummy
# ID Data for parkour entities
scoreboard objectives add activity.parkourID dummy

#!	Fake player initialization

#? Lookup Values
# Activity IDs
# This is to check if the activity slot is empty
scoreboard players set .activity.empty var -1

scoreboard players set .activity.training_hall var 10
scoreboard players set .activity.parkour var 0

scoreboard players set .activity.dragon_munch var 30
scoreboard players set .activity.wolf_encounters var 40

scoreboard players set .activity.cooking.peace var 1
scoreboard players set .activity.cooking.panda var 2

scoreboard players set .activity.boss.tai var 100
scoreboard players set .activity.boss.shen var 200
scoreboard players set .activity.boss.kai var 300

#? Perminant Storage data
#  Map Start Value
scoreboard players set .mapstart var 0

# Overall we want to make sure that activities can only occur when no other activity is being ran!
scoreboard players set .activity.state var -1

# Training Hall Activity Data
scoreboard players set .trainingScore var 0
scoreboard players set .trainingHits var 0

# Parkour Activity Datarelo
scoreboard players set .parkourTimer var 0
scoreboard players set .parkourTimerMax var 3000
scoreboard players set .parkourScore var 0
scoreboard players set .parkourScoreMax var 0
scoreboard players set .parkourID var 0