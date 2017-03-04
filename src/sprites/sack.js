import createItem from '../factories/item';

/**
 * @name Sack
 * Factory function for creating sacks. Sack is a type of treasure
 * that the enemies or the player drop.
 * @param {Phaser.Game} game
 * @param {number} x
 * @param {number} y
 * @param {Item[]} [items=[]]
 * @extends {Sprite}
 */
export default function createSack(game, x, y, items = []) {
    const sprite = game.make.sprite(x, y, 'tiles', 9);

    // composition object
    const sackSprite = Object.assign(
        sprite,
        {
            /**
             * Sacks are never trapped
             * @returns {number=0}
             */
            trapDamage() {
                return 0;
            },

            /**
             * Loot always returns all items and zero gold
             * @returns {Object}
             */
            loot() {
                return {
                    gold: 0,
                    items: items.map(i => createItem(i)),
                };
            },
        },
    );

    sackSprite.anchor.set(0.5);

    return sackSprite;
}
