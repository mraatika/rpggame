import createTreasure from '../factories/treasure';

/**
 * @name Sack
 * Factory function for creating sacks. Sack is a type of treasure
 * that the enemies or the player drop.
 * @param {Phaser.Game} game
 * @param {number} x
 * @param {number} y
 * @param {boolean} shouldThrowForItems If false are items are looted, if true
 *                                      the player should throw dice for them
 * @param {Item[]} [items=[]]
 * @extends {Sprite}
 */
export default function createSack(
    game,
    x,
    y,
    {
        minGold = 0,
        maxGold = 0,
        items = [],
        shouldThrowForItems = false,
    } = {},
) {
    // composition object
    const sackSprite = Object.assign(
        game.make.sprite(x, y, 'tiles', 9),
        createTreasure({ minGold, maxGold, items, shouldThrowForItems }),
        {
            /**
             * Sacks are never trapped
             * @returns {number=0}
             */
            trapDamage: () => 0,
        },
    );

    sackSprite.anchor.set(0.5);

    return sackSprite;
}
