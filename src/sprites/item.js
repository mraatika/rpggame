import SpriteBase from './spritebase';

/**
 * @class Item
 * @description
 * @extends {SpriteBase}
 */
export default class Item extends SpriteBase {
    /**
     * @constructor
     * @param       {Game} game
     * @param       {number} x
     * @param       {number} y
     * @return      {Item}
     */
    constructor(game, x, y, props = {}) {
        super(game, x, y, 'items', props.frame);

        this.attackModifier = props.attackModifier || 0;
        this.defenceModifier = props.defenceModifier || 0;
        this.movementModifier = props.movementModifier || 0;
        this.name = props.name;

        this.isEquippable = props.isEquippable || false;
        this.isEquipped = false;
    }

    /**
     * Equip this item if it's equippable
     */
    equip() {
        if (this.isEquippable) return;
        this.isEquipped = true;
    }

    /**
     * Unequip this item
     */
    unequip() {
        this.isEquipped = false;
    }
}
