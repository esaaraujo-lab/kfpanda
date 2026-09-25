import { Player, system, world } from "@minecraft/server";
import { ScopedTimer, SequenceManager, TitleManagerV2, } from "noxcrew.common.scripting/index.js";
import { seqActivityCountdown } from "../sequences.js";
import { TITLES } from "../titles.js";
import Activity from "./activity.js";
import { RemoveEntityType } from "../util/removeEntity.js";
const locations = {
    COOKING_NOODLES: {
        spawn: { x: 521, y: -52, z: 2058 },
        exit: { x: 511, y: -52, z: 2058 },
        customerType: 'noxcrew:spawn.peace',
        timeLimit: 210 * 20,
        textId: 'noodle',
        medals: {
            gold: 25,
            silver: 15,
            bronze: 7,
        },
        waves: [
            {
                groups: [{ group: 'A', amount: 2 }],
                rush_hour: false,
                loop: false,
            },
            {
                groups: [
                    { group: 'A', amount: 3 },
                    { group: 'B', amount: 1 },
                ],
                rush_hour: false,
                loop: false,
            },
            {
                groups: [
                    { group: 'A', amount: 2 },
                    { group: 'B', amount: 4 },
                ],
                rush_hour: false,
                loop: true,
            },
            {
                groups: [{ group: 'B', amount: 6 }],
                rush_hour: false,
                loop: true,
            },
            {
                groups: [
                    { group: 'A', amount: 5 },
                    { group: 'B', amount: 2 },
                ],
                rush_hour: false,
                loop: true,
            },
            {
                groups: [
                    { group: 'A', amount: 3 },
                    { group: 'B', amount: 5 },
                    { group: 'C', amount: 3 },
                ],
                rush_hour: true,
                loop: true,
            },
        ],
    },
    COOKING_DUMPLINGS: {
        spawn: { x: 4088, y: 124, z: 4136 },
        exit: { x: 4089, y: 124, z: 4139 },
        customerType: 'noxcrew:spawn.panda',
        timeLimit: 360 * 20,
        textId: 'dumplings',
        medals: {
            gold: 28,
            silver: 18,
            bronze: 8,
        },
        waves: [
            {
                groups: [
                    { group: 'A', amount: 1 },
                    { group: 'B', amount: 2 },
                ],
                rush_hour: false,
                loop: false,
            },
            {
                groups: [
                    { group: 'B', amount: 2 },
                    { group: 'C', amount: 2 },
                    { group: 'D', amount: 1 },
                ],
                rush_hour: false,
                loop: false,
            },
            {
                groups: [
                    { group: 'A', amount: 2 },
                    { group: 'B', amount: 6 },
                    { group: 'C', amount: 3 },
                    { group: 'D', amount: 3 },
                    { group: 'E', amount: 2 },
                ],
                rush_hour: true,
                loop: true,
            },
            {
                groups: [
                    { group: 'B', amount: 2 },
                    { group: 'D', amount: 2 },
                    { group: 'E', amount: 1 },
                ],
                rush_hour: false,
                loop: true,
            },
            {
                groups: [
                    { group: 'A', amount: 2 },
                    { group: 'C', amount: 2 },
                    { group: 'D', amount: 3 },
                    { group: 'E', amount: 1 },
                ],
                rush_hour: false,
                loop: true,
            },
            {
                groups: [
                    { group: 'B', amount: 4 },
                    { group: 'D', amount: 2 },
                ],
                rush_hour: false,
                loop: true,
            },
        ],
    },
};
export class CookingActivity extends Activity {
    constructor(container, location) {
        super(container, location);
        this.sequenceManager = this.container.inject(SequenceManager);
        this.titleManager = this.container.inject(TitleManagerV2);
        this.score = 0;
        this.wave = 0;
        this.currentCustomers = [];
        this.cookingRestaurant = locations[location] ?? locations[0];
        this.customerType = this.cookingRestaurant.customerType;
        this.CUSTOMER_SPAWN = this.cookingRestaurant.spawn;
        this.CUSTOMER_EXIT = this.cookingRestaurant.exit;
    }
    async onActivate() {
        super.onActivate();
        await this.sequenceManager.runAndWait(seqActivityCountdown, this);
        for (const seat of this.dimension.getEntities({ type: 'noxcrew.kp:restaurant_seat' })) {
            seat.triggerEvent('noxcrew:to.seat_available');
        }
        this.spawnWave();
        ScopedTimer.schedule(this, this.cookingRestaurant.timeLimit, () => this.end());
        ScopedTimer.schedule(this, this.cookingRestaurant.timeLimit - 30 * 20, () => {
            for (const player of world.getAllPlayers()) {
                player.sendMessage({ translate: 'txt.gs.msg2' });
                player.playSound('activity_timer_30', { location: player.location });
            }
        });
    }
    onDeactivate() {
        super.onDeactivate();
        this.cleanCooking();
        const targetCustomers = this.dimension.getEntities({ type: CookingActivity.CUSTOMER_ENTITY_ID }) ?? null;
        if (targetCustomers !== null) {
            targetCustomers.forEach(entity => {
                entity.setProperty('noxcrew:state', 'leaving');
            });
        }
    }
    setup() {
        this.listenFor(system.afterEvents.scriptEventReceive, e => {
            switch (e.id) {
                case 'noxcrew.kp:customer.eat':
                    if (e.sourceEntity?.typeId == CookingActivity.CUSTOMER_ENTITY_ID) {
                        this.score += e.message == 'angry' ? 1 : 2;
                    }
                    break;
                case 'noxcrew.kp:customer.leaving':
                    if (e.sourceEntity?.typeId == CookingActivity.CUSTOMER_ENTITY_ID) {
                        this.currentCustomers.splice(this.currentCustomers.indexOf(e.sourceEntity.id), 1);
                        if (this.currentCustomers.length == 0) {
                            for (const player of world.getAllPlayers()) {
                                player.onScreenDisplay.setTitle('nox:popup_ping2');
                            }
                            ScopedTimer.schedule(this, 80, () => {
                                this.spawnWave();
                            });
                        }
                    }
                    break;
                case 'noxcrew.kp:cooking_error':
                    if (e.sourceEntity == undefined || !(e.sourceEntity instanceof Player)) {
                        return;
                    }
                    this.titleManager.addTitle(TITLES.ping_incorrect);
            }
        });
    }
    endMessage() {
        const cookingResultMsg = {
            translate: `txt.activity_${this.cookingRestaurant.textId}.counter`,
            with: [`${this.score}`],
        };
        world.sendMessage(cookingResultMsg);
        let tier = `txt.activity_${this.cookingRestaurant.textId}.tier0`;
        if (this.score >= this.cookingRestaurant.medals.gold) {
            tier = `txt.activity_${this.cookingRestaurant.textId}.tier3`;
        }
        else if (this.score >= this.cookingRestaurant.medals.silver) {
            tier = `txt.activity_${this.cookingRestaurant.textId}.tier2`;
        }
        else if (this.score >= this.cookingRestaurant.medals.bronze) {
            tier = `txt.activity_${this.cookingRestaurant.textId}.tier1`;
        }
        else if (this.score != 0) {
            tier = `txt.activity_${this.cookingRestaurant.textId}.tier0_1`;
        }
        world.sendMessage({ rawtext: [{ translate: `${tier}` }] });
    }
    spawnWave() {
        const waves = this.cookingRestaurant.waves;
        while (!waves[this.wave % waves.length].loop && this.wave >= waves.length) {
            this.wave++;
        }
        const customers = [];
        for (const group of waves[this.wave % waves.length].groups) {
            for (let i = 0; i < group.amount; i++) {
                customers.push(group.group);
            }
        }
        customers.sort(() => Math.random() - 0.5);
        this.summonCustomers(customers);
        this.wave++;
    }
    summonCustomers(customers) {
        let customer = this.dimension.spawnEntity(CookingActivity.CUSTOMER_ENTITY_ID, this.CUSTOMER_SPAWN);
        customer.triggerEvent(this.customerType);
        customer.triggerEvent(`noxcrew:set.group.${customers.pop()?.toLowerCase()}`);
        this.currentCustomers.push(customer.id);
        if (customers.length != 0) {
            ScopedTimer.schedule(this, 15 + Math.floor(Math.random() * 26), () => {
                this.summonCustomers(customers);
            });
        }
    }
    cleanCooking() {
        RemoveEntityType(CookingActivity.CUSTOMER_ENTITY_ID);
        CookingActivity.cleanStations();
    }
    static cleanStations() {
        const dim = world.getDimension('overworld');
        dim.getEntities({ type: 'noxcrew.kp:steaming_station' }).forEach(e => {
            e.triggerEvent('noxcrew:set.state.waiting');
        });
        dim.getEntities({ type: 'noxcrew.kp:boiling_station' }).forEach(e => {
            e.triggerEvent('noxcrew:set.state.waiting');
        });
        dim.getEntities({ type: 'noxcrew.kp:work_station' }).forEach(e => {
            e.triggerEvent('noxcrew:set.item.none');
        });
        dim.getEntities({ type: 'noxcrew.kp:serving_station' }).forEach(e => {
            e.triggerEvent('noxcrew:set.item.none');
        });
    }
}
CookingActivity.CUSTOMER_ENTITY_ID = 'noxcrew.kp:customer';
