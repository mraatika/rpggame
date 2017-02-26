import Events from '../events/events';

/**
 * @exports
 * @class Item
 * @description
 */
export default class Item {
    /**
     * Creates an instance of Item.
     * @param {Object} [props={}]
     * @memberOf Item
     */
    constructor(props = {}) {
        this.id = props.id;
        this.name = props.name;

        this.attackModifier = props.attackModifier || 0;
        this.defenceModifier = props.defenceModifier || 0;
        this.movementModifier = props.movementModifier || 0;

        this.frame = props.frame;
        this.itemGroup = props.itemGroup;

        this.isEquippable = props.isEquippable || true;
        this.isEquipped = false;
    }

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
    }

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
    }
}
