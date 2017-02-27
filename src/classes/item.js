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
        Object.assign(this, props);
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
