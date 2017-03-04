import Action from './action';
import ActionTypes from '../constants/actiontypes';
import { sendEvent } from '../events/eventdispatcher';
import EventTypes from '../constants/eventtypes';
import { shouldBeActorSprite, shouldBeTreasure } from '../utils/validations';

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
            actor: (value) => {
                if (value && !value.purse) return 'is invalid';
                return shouldBeActorSprite(value);
            },
            treasure: shouldBeTreasure,
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
        const { actor, treasure } = this;
        const damage = treasure.trapDamage();

        if (damage) {
            actor.damage(damage);
            actor.emitText(-1 * damage);
            sendEvent(EventTypes.DAMAGE_EVENT, { actor, damage });
        }

        const loot = treasure.loot(actor);

        actor.purse.addGold(loot.gold);
        actor.purse.add(loot.items);

        loot.items.forEach((item) => {
            if (!actor.purse.getEquippedItemOfGroup(item.itemGroup)) {
                actor.purse.equipItem(item);
            }
        });

        treasure.destroy();

        sendEvent(EventTypes.LOOT_EVENT, { actor, treasure, loot });

        return true;
    }
}
