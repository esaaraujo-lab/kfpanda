import { world } from "@minecraft/server";
import { Multimap } from "../api/index.js";
import { ScopedTimer } from "./util/scopedTimer.js";
import { TickingModule } from "./tickingModule.js";
export class TitleManagerV2 extends TickingModule {
    constructor(container) {
        super(container, 15);
        this.counter = 0;
        // fixme(lucy): why did i think this was a good idea????
        // this is a textbook memory leak. i'll fix it once i've moved
        this.registeredTitles = new Map();
        this.playerTitles = new Multimap();
        this.tickingTitles = new Map();
    }
    setup() { }
    /**
     * Adds a title event.
     * @returns a unique handle for the title
     */
    addTitle(event) {
        const newTitleId = ++this.counter;
        this.registeredTitles.set(newTitleId, event);
        for (const target of event.targets ?? world.getAllPlayers()) {
            this.playerTitles.add(target.id, newTitleId);
            this.playerTitles
                .get(target.id)
                ?.sort((one, two) => (this.registeredTitles.get(two)?.weight ?? 0) - (this.registeredTitles.get(one)?.weight ?? 0));
            this.updateTitles(target.id);
        }
        if (event.type == 'one-off') {
            ScopedTimer.schedule(this, event.duration, () => this.removeTitle(newTitleId));
        }
        return newTitleId;
    }
    /**
     * Removes a title event.
     * @param event the title event's handle, as returned by {@link add}
     */
    removeTitle(event) {
        for (const player of this.playerTitles.removeValue(event)) {
            this.updateTitles(player);
        }
    }
    /** Replaces all text components for a registered title. */
    replaceTitle(handle, titles) {
        const event = this.registeredTitles.get(handle);
        if (event == null)
            return;
        event.components = titles;
        this.tick();
    }
    updateTitles(playerId) {
        const player = world.getEntity(playerId);
        // If the player's gone offline, remove all their titles.
        if (player == undefined) {
            this.playerTitles.delete(playerId);
            return;
        }
        // If there's no array then the player has never had any titles set.
        const titleIds = this.playerTitles.get(playerId);
        if (titleIds == undefined)
            return;
        const titles = titleIds.map(id => [id, this.registeredTitles.get(id)]);
        const title = titles.find(it => !!it[1]?.components.title);
        const subtitle = titles.find(it => !!it[1]?.components.subtitle);
        const actionbar = titles.find(it => !!it[1]?.components.actionbar);
        const titleIsUiTrigger = title?.[1]?.type == 'one-off' && title[1].isUi == true;
        this.tickingTitles.set(playerId, {
            title: titleIsUiTrigger ? undefined : title?.[0],
            subtitle: subtitle?.[0],
            actionbar: actionbar?.[0],
        });
        this.sendTitles(player, {
            title: title?.[1]?.components.title,
            subtitle: subtitle?.[1]?.components.subtitle,
            actionbar: subtitle?.[1]?.components.actionbar,
        });
    }
    sendTitles(player, titles) {
        if (titles.title != undefined) {
            player.onScreenDisplay.setTitle(titles.title, TitleManagerV2.titleTimes);
        }
        if (titles.subtitle != undefined) {
            // Set title first in case it is not
            if (titles.title == undefined) {
                player.onScreenDisplay.setTitle(' ', TitleManagerV2.titleTimes);
            }
            player.onScreenDisplay.updateSubtitle(titles.subtitle);
        }
        if (titles.actionbar != undefined) {
            player.onScreenDisplay.setActionBar(titles.actionbar);
        }
    }
    tick() {
        for (const [playerId, titles] of this.tickingTitles) {
            const player = world.getEntity(playerId);
            if (player == undefined)
                continue;
            const title = titles.title ? this.registeredTitles.get(titles.title) : undefined;
            const subtitle = titles.subtitle ? this.registeredTitles.get(titles.subtitle) : undefined;
            const actionbar = titles.actionbar ? this.registeredTitles.get(titles.actionbar) : undefined;
            this.sendTitles(player, {
                title: title?.components.title,
                subtitle: subtitle?.components.subtitle,
                actionbar: actionbar?.components.actionbar,
            });
        }
    }
}
TitleManagerV2.titleTimes = {
    stayDuration: 20,
    fadeInDuration: 0,
    fadeOutDuration: 4,
};
//# sourceMappingURL=titleManagerV2.js.map