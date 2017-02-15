import { Sprite } from 'phaser';

const FADE_SPEED = 150;

/**
 * @class SpriteBase
 * @description Base class for all the Sprites
 * @extends {Sprite}
 */
export default class SpriteBase extends Sprite {

    constructor(game, x, y, imageKey, frame) {
        super(game, x, y, imageKey, frame);
        this.game = game;
    }

    /**
     * Set anchor to the middle of this sprite
     * @return {undefined}
     */
    center() {
        this.anchor.set(0.5);
    }

    /**
     * Show this sprite with a fade
     * @param  {Function} [callback]
     * @param  {number} [speed] Animation duration
     * @param  {number} [alpha] Target opacity
     * @return {undefined}
     */
    fadeIn(callback, speed, alpha) {
        this.changeAlphaTo(alpha || 1, callback, speed);
    }

    /**
     * Hide this sprite with a fade
     * @param  {Function} [callback]
     * @param  {number} [speed] Animation duration
     * @return {undefined}
     */
    fadeOut(callback, speed) {
        this.changeAlphaTo(0, callback, speed);
    }

    /**
     * Change alpha to given with an animation
     * @param   {number} alpha
     * @param   {Function} [callback]
     * @param   {number} [speed]
     * @return  {[type]}
     * @private
     */
    changeAlphaTo(alpha, callback = () => {}, speed = FADE_SPEED) {
        this.game.add.tween(this)
            .to({ alpha }, speed)
            .start()
            .onComplete.add(callback, this);
    }
}
