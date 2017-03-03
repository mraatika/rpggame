import { Easing } from 'phaser';

/**
 * Display an icon or a text that's moving up and fading out from this sprite
 * @private
 * @param  {Phaser.Game} game
 * @param  {Sprite|Text} subject Sprite or text to emit
 * @param  {Function} callback
 */
function emit(game, subject, callback = () => {}) {
    game.add.tween(subject)
        .to({ y: subject.y - 50, alpha: 0 }, 800, Easing.Quadratic.In, true, 150)
        .onComplete.add(() => {
            subject.destroy();
            callback.call(null);
        });
}

/**
 * @name EmitterSprite
 * A sprite that is capable to emit icons and text. Can be
 * added as composition to actors (should be actor sprite).
 * @param {Phaser.Game} game
 * @returns {EmitterSprite}
 */
export default function createEmitterSprite(game, actor) {
    return {
         /**
         * Display an icon that's moving up and fading out from this sprite
         * @param  {string} frameName
         * @param  {Function} callback
         */
        emitIcon(frameName, callback) {
            const frames = {
                shield: 0,
                sword: 1,
                heart: 2,
            };
            const icon = game.add.sprite(actor.x, actor.y - 20, 'icons');
            icon.frame = frames[frameName];
            icon.anchor.set(0.5);
            emit(game, icon, callback);
        },

        /**
         * Display a text that's moving up and fading out from this sprite
         * @param  {string} text
         * @param  {Function} callback
         */
        emitText(text, callback) {
            const t = game.add.text(actor.x - (actor.width / 2), actor.y - 50, text);
            t.font = 'komika_axisregular';
            t.fontSize = '20px';
            t.fill = '#fff';
            t.stroke = '#000';
            t.strokeThickness = 2;

            emit(game, t, callback);
        },
    };
}
