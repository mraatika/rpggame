import gameConfig from '../config/gameconfig.json';
import { sendEvent } from '../events/eventdispatcher';
import EventTypes from '../constants/eventtypes';

const config = gameConfig.items;

/**
 * @exports
 * @name Item
 * A factory function for creating item objects
 * @returns {Item}
 */
export default function createItem(props = {}) {
    /**
     * Public properties
     */
    const publicProperties = Object.assign(
        {
            id: '',
            name: '',
            chance: 1,
            attackModifier: 0,
            defenceModifier: 0,
            movementModifier: 0,
            itemGroup: null,
            description: '',
            frame: '',
            isEquippable: true,
            isEquipped: false,
        },
        // props from game config
        config[props.id],
        // props given as argument
        props,
    );

    const methods = {
        /**
         * Equip this item if it's equippable
         * @param {boolean} [condition=true] If false will unequip
         * @fires EventTypes#ITEM_EQUIPPED_EVENT
         * @returns {undefined}
         * @memberOf Item
         */
        equip() {
            if (this.isEquippable) {
                this.isEquipped = true;
                sendEvent(EventTypes.ITEM_EQUIPPED_EVENT, { item: this, condition: true });
            }
        },

        /**
         * Unequip this item if equipped
         * @fires EventTypes#ITEM_EQUIPPED_EVENT
         * @memberOf Item
         */
        unequip() {
            if (this.isEquipped) {
                this.isEquipped = false;
                sendEvent(EventTypes.ITEM_EQUIPPED_EVENT, { item: this, condition: false });
            }
        },
    };

    return Object.assign(
        {},
        publicProperties,
        methods,
    );
}
