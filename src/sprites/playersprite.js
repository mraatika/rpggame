import createPlayer from '../factories/player';
import createEmitterSprite from '../factories/emittersprite';

/**
 * @name {Player}
 * Factory for creating a player sprite.
 * @param {Phaser.Game} game
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {Object} [props={}]
 * @extends {Sprite}
 * @extends {EmitterSprite}
 * @extends {Player}
 */
export default function createPlayerSprite(game, x = 0, y = 0, props = {}) {
    const sprite = game.make.sprite(x, y, 'actors', 0);
    sprite.anchor.set(0.5);

    return Object.assign(
        sprite,
        createEmitterSprite(game, sprite),
        createPlayer(props),
    );
}
