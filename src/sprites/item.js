import SpriteBase from 'sprites/spritebase';

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
        super(game, x, y, props.imageKey);

        this.attackModifier = props.attackModifier || 0;
        this.defenceModifier = props.defenceModifier || 0;

        this.isEquippable = props.isEquippable || false;
        this.isEquipped = false;
    }

    /**
     * Equip this item if it's equippable
     * @return {undefined}
     */
    equip() {
        if (this.isEquippable) return;
        this.isEquipped = true;
    }
}