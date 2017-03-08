import action from './action';
import ActionTypes from '../constants/actiontypes';
import { sendEvent } from '../events/eventdispatcher';
import EventTypes from '../constants/eventtypes';
import { shouldBeActorSprite, shouldBeTreasure } from '../utils/validations';
import LootDialog from '../vue/lootdialog';
import mount from '../vue/vuerenderer';

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
    let loot;

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

            loot = treasure.loot(actor);
            actor.purse.addGold(loot.gold);

            /**
             * Callback for item menu close
             * @param {Item[]} lootedItems
             */
            const onActionDone = (lootedItems = []) => {
                this.pending = false;

                treasure.destroy();

                sendEvent(EventTypes.LOOT_EVENT, {
                    actor,
                    treasure,
                    loot: { gold: loot.gold, items: lootedItems },
                });
            };

            // if there are no items to be looted then call action done immediately
            if (!loot.items.length) {
                onActionDone();
                return true;
            }

            // set action pending until loot menu is hidden
            this.pending = true;

            // show loot menu dialog
            mount(LootDialog, {
                initialItems: loot.items,
                character: actor,
                onClose: onActionDone,
            }).show();

            return true;
        },
    };

    return Object.assign(
        action(ActionTypes.LOOT_ACTION, validations, { actor, treasure, priority: 1 }),
        methods,
    );
}
