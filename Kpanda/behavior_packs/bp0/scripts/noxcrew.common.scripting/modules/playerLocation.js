import { TickingModule } from "./tickingModule.js";
import { world } from "@minecraft/server";
import { EventDispatcher } from "../api/events/index.js";
/**
 * A module responsible with handling players entering and leaving locations.
 * Runs events on location exit, enter, and tick.
 */
export class PlayerLocationManager extends TickingModule {
    constructor(container, playerLocations) {
        super(container, 1);
        this.playerLocations = playerLocations;
        //! FIXME [Lyfeless]: Adjust this system to use world properties rather than scoreboard
        //      Currently we don't have an approach that handles creating properties on creation,
        //      Once that exists revisit here
        this.objective = world.scoreboard.getObjective('p.loc') ?? world.scoreboard.addObjective('p.loc', 'Player Loc');
    }
    onActivate() {
        super.onActivate();
    }
    /**
     * Loop function, called once after every specified time delay
     *
     * Handles all players leaving, joining, and ticking for given locations
     */
    tick() {
        for (const player of world.getAllPlayers()) {
            const playerScoreID = player.scoreboardIdentity;
            if (playerScoreID == undefined) {
                this.objective.setScore(player, -1);
                return;
            }
            const currentLocation = this.objective.getScore(playerScoreID) ?? -1;
            if (currentLocation == -1 || !this.playerLocations[currentLocation].bounds(player)) {
                if (currentLocation != -1) {
                    this.leaveLocation(player, currentLocation);
                }
                for (let i = 0; i < this.playerLocations.length; ++i) {
                    if (i != currentLocation) {
                        if (this.playerLocations[i].bounds(player)) {
                            this.joinLocation(player, i);
                            break;
                        }
                    }
                }
            }
            else if (currentLocation == -1) {
                const location = this.playerLocations[currentLocation];
                location.handleTick(player);
                PlayerLocationManager.events.dispatch({ type: 'tick', player, location });
            }
        }
    }
    /**
     * Set player's active room to specified location
     * @param player The player to set
     * @param location The index of the location in the data array
     */
    joinLocation(player, locationIdx) {
        this.objective.setScore(player, locationIdx);
        const location = this.playerLocations[locationIdx];
        location.handleJoin(player);
        PlayerLocationManager.events.dispatch({ type: 'join', player, location });
    }
    /**
     * Clear player's active room from the specified location
     * @param player The player to clear
     * @param location The index of the location in the data array
     */
    leaveLocation(player, locationIdx) {
        this.objective.setScore(player, -1);
        const location = this.playerLocations[locationIdx];
        location.handleLeave(player);
        PlayerLocationManager.events.dispatch({ type: 'leave', player, location });
    }
}
/** Dispatches {@link PlayerLocationEvent}s. */
PlayerLocationManager.events = new EventDispatcher();
//# sourceMappingURL=playerLocation.js.map