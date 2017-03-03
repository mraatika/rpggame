import createTreasure from '../factories/treasure';

/**
 * @name TreasureSprite
 * Factory function for creating treasure sprites.
 * @extends {Sprite}
 * @extends {Treasure}
 * @returns {TreasureSprite}
 */
export default function createTreasureSprite(game, x, y, frame = 10, props = {}) {
    const propsCopy = Object.assign({}, props);

    if (typeof props.items === 'string') {
        propsCopy.items = JSON.parse(props.items);
    }

    const treasureSprite = Object.assign(
        game.make.sprite(x, y, 'tiles', frame),
        createTreasure(propsCopy),
    );

    treasureSprite.anchor.set(0.5);

    return treasureSprite;
}
