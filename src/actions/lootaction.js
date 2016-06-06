import Action from 'actions/action';
import ActionTypes from 'actions/actiontypes';

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

        const loot = this.loot = this.treasure.loot(this.actor);

        this.actor.purse.addGold(loot.gold);
        this.actor.purse.add(loot.items);

        this.treasure.destroy();

        return true;
    }
}