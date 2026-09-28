import { world } from "@minecraft/server";
import { GetPlayerFromName } from "../api/index.js";
import { TickingModule } from "./tickingModule.js";
/**
 * Manages displaying and storing any text displayed on the player's title, subtitle, or action bar.
 * @deprecated
 */
export class TitleManager extends TickingModule {
    constructor(container, titleOptions) {
        super(container, 10);
        this.titleOptions = titleOptions;
        this.playerTitles = new Map();
    }
    setup() {
        this.listenFor(world.afterEvents.playerSpawn, e => {
            this.checkPlayerRejoin(e.player);
        });
    }
    tick() {
        this.playerTitles.forEach((val, key) => {
            const player = GetPlayerFromName(key);
            if (player == null)
                return;
            this.sendTitles(player, val);
        });
    }
    //#region Internal Implementation Functions
    /**
     * Display all of a player's highest weight title elements
     * @param player the player to send the elements to
     * @param playerTitle the player's title data
     * @param skipTickCheck if true, ignores the element's tick value and always prints the element
     */
    sendTitles(player, playerTitle, skipTickCheck = false) {
        const titleText = this.getStringFromElement(playerTitle, 'title', skipTickCheck);
        const subtitleText = this.getStringFromElement(playerTitle, 'subtitle', skipTickCheck);
        const actionbarText = this.getStringFromElement(playerTitle, 'actionbar', skipTickCheck);
        if (titleText != undefined) {
            player.onScreenDisplay.setTitle(titleText, TitleManager.titleTimes);
        }
        if (subtitleText != undefined) {
            // Set title first in case it is not
            if (titleText == undefined) {
                player.onScreenDisplay.setTitle(' ', TitleManager.titleTimes);
            }
            player.onScreenDisplay.updateSubtitle(subtitleText);
        }
        if (actionbarText != undefined) {
            player.onScreenDisplay.setActionBar(actionbarText);
        }
    }
    /**
     * Converts title element to printable text
     * @param playerTitle player's title data
     * @param type which element to use
     * @param skipTickCheck if true, ignores the element's tick value and always prints the element
     * @returns printable text, either as string or as translated rawtext object
     */
    getStringFromElement(playerTitle, type, skipTickCheck) {
        const element = playerTitle[type];
        if (element == undefined) {
            return undefined;
        }
        if (!skipTickCheck && !element.tick) {
            return undefined;
        }
        return element.text;
    }
    /**
     * Find player's highest weight version of each element from available active titles and apply new titles
     * @param player the player reciving the titles
     * @param playerTitle the player's title data
     */
    findHighestPriorityTitles(player, playerTitle) {
        playerTitle.activeTitles.sort((a, b) => this.titleOptions.get(b).weight - this.titleOptions.get(a).weight);
        const groups = playerTitle.activeTitles.map(name => this.titleOptions.get(name));
        playerTitle.title = groups.find(it => !!it?.title)?.title;
        playerTitle.subtitle = groups.find(it => !!it?.subtitle)?.subtitle;
        playerTitle.actionbar = groups.find(it => !!it?.actionbar)?.actionbar;
        this.sendTitles(player, playerTitle, true);
    }
    /**
     * Check if player has titles on rejoin and resend
     * @param player the player reciving the titles
     */
    checkPlayerRejoin(player) {
        let playerTitle = this.playerTitles.get(player.name);
        if (playerTitle == undefined) {
            const storedTitles = player.getDynamicProperty(TitleManager.titleStorageId);
            if (typeof storedTitles !== 'string')
                return;
            const titleList = storedTitles.split(',');
            playerTitle = this.addPlayerToList(player, titleList);
        }
        this.findHighestPriorityTitles(player, playerTitle);
    }
    /**
     * Give player a new entry in the title list
     * @param player player recieving entry
     * @param activeTitles currently active titles, defaults to empty
     * @returns player's new title entry
     */
    addPlayerToList(player, activeTitles = []) {
        const playerTitle = { activeTitles, title: undefined, subtitle: undefined, actionbar: undefined };
        this.playerTitles.set(player.name, playerTitle);
        return playerTitle;
    }
    //#endregion
    //#region Pubic Accessor Functions
    /**
     * Add new title to player's active title list and recheck/resend priority elements
     * @param player player recieving the title
     * @param title the title's name
     */
    add(player, title) {
        if (!this.titleOptions.has(title)) {
            return;
        }
        let playerTitle = this.playerTitles.get(player.name);
        if (playerTitle == undefined) {
            playerTitle = this.addPlayerToList(player);
        }
        else if (playerTitle.activeTitles.includes(title)) {
            return;
        }
        playerTitle.activeTitles.push(title);
        this.findHighestPriorityTitles(player, playerTitle);
        player.setDynamicProperty(TitleManager.titleStorageId, playerTitle.activeTitles.toString());
    }
    /**
     * Remove active title from player's active title list and recheck/resend priority elements
     * @param player player losing the title
     * @param title the title's name
     */
    remove(player, title) {
        const playerTitle = this.playerTitles.get(player.name);
        if (playerTitle == undefined || !playerTitle.activeTitles.includes(title)) {
            return;
        }
        const findIndex = playerTitle.activeTitles.indexOf(title, 0);
        playerTitle.activeTitles.splice(findIndex, 1);
        // Remove entry from titles if there are no active titles on the player
        if (playerTitle.activeTitles.length == 0) {
            this.playerTitles.delete(player.name);
            player.setDynamicProperty(TitleManager.titleStorageId, undefined);
            return;
        }
        this.findHighestPriorityTitles(player, playerTitle);
        player.setDynamicProperty(TitleManager.titleStorageId, playerTitle.activeTitles.toString());
    }
    /**
     * Reset the whole of the players title list to make sure the player is properly reset and done with titles
     * @param player player losing the title
     */
    reset(player) {
        const playerTitle = this.playerTitles.get(player.name);
        if (playerTitle == undefined) {
            return;
        }
        // Remove entry from titles if there are no active titles on the player
        if (playerTitle.activeTitles.length >= 0) {
            this.playerTitles.delete(player.name);
            player.setDynamicProperty(TitleManager.titleStorageId, undefined);
            return;
        }
    }
}
TitleManager.titleTimes = {
    stayDuration: 20,
    fadeInDuration: 0,
    fadeOutDuration: 4,
};
TitleManager.titleStorageId = 'noxcrew.proj:activeTitles';
//# sourceMappingURL=titleManager.js.map