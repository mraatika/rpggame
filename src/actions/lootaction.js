import Action from './action';
import ActionTypes from '../constants/actiontypes';
import Events from '../events/events';
import Treasure from '../sprites/treasure';
import { shouldBeActor, shouldBeInstanceOf } from '../utils/validations';

/**
 * @export
 * @class LootAction
 * @description A class representing looting of a treasure
 * @extends {Action}
 */
export default class LootAction extends Action {
    /**
     * @readonly
     * @memberOf LootAction
     */
    get validations() {
        return {
            actor: shouldBeActor,
            treasure: shouldBeInstanceOf(Treasure),
        };
    }

    /**
     * Creates an instance of LootAction.
     * @param {Command} command
     * @memberOf LootAction
     */
    constructor(command) {
        const { actor, treasure } = command;
        super(ActionTypes.LOOT_ACTION, { actor, treasure, priority: 1 });
    }

    /**
     * @return {Boolean} true
     * @memberOf LootAction
     */
    execute() {
        const damage = this.treasure.trapDamage();

        if (damage) {
            this.actor.damage(damage);
            this.actor.emitText(-1 * damage);
            new Events.DamageEvent(this.actor, damage).dispatch();
        }

        const loot = this.treasure.loot(this.actor);

        this.actor.purse.addGold(loot.gold);
        this.actor.purse.add(loot.items);

        loot.items.forEach((item) => {
            if (!this.actor.purse.hasItemOfGroupEquipped(item.itemGroup)) {
                this.actor.purse.equipItem(item);
            }
        });

        this.treasure.destroy();

        new Events.LootEvent(this.actor, this.treasure, loot).dispatch();

        return true;
    }
}
