import {Easing} from 'phaser';
import {reduce, sum} from 'lodash';
import SpriteBase from 'sprites/spritebase';
import Dice from 'classes/dice';

/**
 * @class Actor
 * @description A base class for all acting characters (npc or player controlled)
 * @extends {Sprite}
 */
export default class Actor extends SpriteBase {

    constructor(...props) {
        super(...props);
        this.center();
    }

    decideAction() {}

    /**
     * Throw dices for attack
     * @return {number} The number of successes
     */
    throwAttack() {
        return this._throwDicesForSuccesses(this.attack);
    }

    /**
     * Throw dices for defence
     * @return {number} The number of successes
     */
    throwDefence() {
        return this._throwDicesForSuccesses(this.defence);
    }

    /**
     * Throw dices for movement
     * @return {number} The number of successes
     */
    throwMovement() {
        return (this.movementPoints = this._throwDicesForSum(this.movement));
    }

    /**
     * Display an icon that's moving up and fading out from this sprite
     * @param  {string} frameName
     * @param  {Function} callback
     */
    emitIcon(frameName, callback) {
        const frames = {
            'shield': 0,
            'sword': 1,
            'heart': 2
        };
        const icon = this.game.add.sprite(this.x, this.y - 20, 'icons');
        icon.frame = frames[frameName];
        icon.anchor.set(.5);
        this._emit(icon, callback);
    }

    /**
     * Display a text that's moving up and fading out from this sprite
     * @param  {string} text
     * @param  {Function} callback
     */
    emitText(text, callback) {
        const t = this.game.add.text(this.x - this.width / 2, this.y - 50, text);
        t.font = 'komika_axisregular';
        t.fontSize = '20px';
        t.fill = '#fff';
        t.stroke = '#000';
        t.strokeThickness = 2;

        this._emit(t, callback);
    }

    /**
     * Display an icon or a text that's moving up and fading out from this sprite
     * @private
     * @param  {Sprite|Text} target
     * @param  {Function} callback
     */
    _emit(target, callback = () => {}) {
        this.game.add.tween(target)
            .to({ y: target.y - 50, alpha: 0 }, 800, Easing.Quadratic.In, true, 150)
            .onComplete.add(() => {
                target.destroy();
                callback.call(null);
            });
    }

    /**
     * Throw dices counting sum of values
     * @private
     * @param   {number} amount
     * @return  {number}
     */
    _throwDicesForSum(amount) {
        return sum(this._throwDices(amount));
    }

    /**
     * Throw dices counting only successes
     * @private
     * @param   {number} amount Amount of dices to throw
     * @return  {number} The amount of successes
     */
    _throwDicesForSuccesses(amount) {
        const results = this._throwDices(amount);

        return reduce(results, (memo, value) => {
            return memo + (value > 3 ? 1 : 0);
        }, 0);
    }

    /**
     * Throw given amount of dices
     * @private
     * @param   {number} count The amount of dices to throw
     * @return  {number} The number of successes
     */
    _throwDices(count) {
        const dice = new Dice(6);
        let results = [];

        for (let i = 0; i < count; i++) {
            results.push(dice.throw());
        }

        return results;
    }
}