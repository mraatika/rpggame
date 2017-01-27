import {each} from 'lodash';
import Action from 'actions/action';
import ActionTypes from 'actions/actiontypes';
import Events from 'events/events';

/**
 * @class LootAction
 * @description A class representing looting of a treasure
 * @extends {Action}
 */
export default class LootAction extends Action {

    /**
     * Getter for action type
     * @return {Symbol}
     */
    get type() {
        return ActionTypes.LOOT_ACTION;
    }

    /**
     * @constructor
     * @param       {Command} command
     * @return      {LootAction}
     */
    constructor(command) {
        super(command);
        this.treasure = command.treasure;
        this.priority = 1;
    }

    /**
     * Execute this action
     * @return {boolean} true
     */
    execute() {
        const damage = this.treasure.trapDamage();

        if (damage) {
            this.actor.damage(damage);
            this.actor.emitText(-1 * damage);
        }

        const loot = this.treasure.loot(this.actor);

        this.actor.purse.addGold(loot.gold);
        this.actor.purse.add(loot.items);

        each(loot.items, item => {
            if (!this.actor.purse.hasItemOfGroupEquipped(item.itemGroup)) {
                this.actor.purse.equipItem(item);
            }
        });

        this.treasure.destroy();

        new Events.LootEvent(this.actor, this.treasure, loot).dispatch();

        return true;
    }
}