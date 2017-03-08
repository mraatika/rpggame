import action from './action';
import ActionTypes from '../constants/actiontypes';
import { sendEvent } from '../events/eventdispatcher';
import EventTypes from '../constants/eventtypes';
import { shouldBeActorSprite, shouldBeTreasure } from '../utils/validations';

/**
 * @export
 * @name LootAction
 * Factory function for creating an action of looting a treasure
 * @param {Object} command
 * @returns {LootAction}
 * @extends {Action}
 */
export default function LootAction(command = {}) {
    const { actor, treasure } = command;

    const validations = {
        actor: (value) => {
            if (value && !value.purse) return 'is invalid';
            return shouldBeActorSprite(value);
        },
        treasure: shouldBeTreasure,
    };

    const methods = {
        /**
         * @return {Boolean} true
         * @memberOf LootAction
         */
        execute() {
            const damage = treasure.trapDamage();

            if (damage) {
                actor.damage(damage);
                actor.emitText(-1 * damage);
                sendEvent(EventTypes.DAMAGE_EVENT, { actor, damage });
            }

            const loot = treasure.loot(actor);

            actor.purse.addGold(loot.gold);
            actor.purse.add(loot.items);

            treasure.destroy();

            sendEvent(EventTypes.LOOT_EVENT, { actor, treasure, loot });

            return true;
        },
    };

    return Object.assign(
        action(ActionTypes.LOOT_ACTION, validations, { actor, treasure, priority: 1 }),
        methods,
    );
}
