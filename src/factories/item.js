import Events from '../events/events';
import gameConfig from '../config/gameconfig.json';

const config = gameConfig.items;

/**
 * Default item props
 * @type {Object}
 */
const itemDefaults = {
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
};

/**
 * @exports
 * @name Item
 * A factory function for creating item objects
 * @returns {Item}
 */
export default function createItem(props = {}) {
    return Object.assign(
        {},
        // default props
        itemDefaults,
        // props from game config
        config[props.id],
        // item properties
        props,
        // item methods
        {
            /**
             * Equip this item if it's equippable
             * @param {boolean} [condition=true] If false will unequip
             * @fires Events#ItemEquippedEvent
             * @returns {undefined}
             * @memberOf Item
             */
            equip() {
                if (this.isEquippable) {
                    this.isEquipped = true;
                    new Events.ItemEquippedEvent(this, true).dispatch();
                }
            },

            /**
             * Unequip this item if equipped
             * @fires Events#ItemEquippedEvent
             * @memberOf Item
             */
            unequip() {
                if (this.isEquipped) {
                    this.isEquipped = false;
                    new Events.ItemEquippedEvent(this, false).dispatch();
                }
            },
        },
    );
}
