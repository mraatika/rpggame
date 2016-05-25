import Actor from 'sprites/actor';
import gameConfig from 'json!assets/config/gameconfig.json';
import {reduce} from 'lodash';
import Purse from 'classes/purse';
import UserMovementStrategy from 'movement/usermovementstrategy';

/**
 * Player defaults from game config
 * @type {object}
 */
const config = gameConfig.player;

/**
 * @class Player
 * @description
 * @extends {Actor}
 */
export default class Player extends Actor {

    /**
     * Getter for total attack value
     * @return {number}
     */
    get attack() {
        return this._getModifiersFor(this.defaultAttack, 'attackModifier');
    }

    /**
     * Getter for total defence value
     * @return {number}
     */
    get defence() {
        return this._getModifiersFor(this.defaultDefence, 'defenceModifier');
    }

    /**
     * Getter for total movement value
     * @return {number}
     */
    get movement() {
        return this._getModifiersFor(this.defaultMovement, 'movementModifier');
    }

    /**
     * @constructor
     * @param       {Game} game
     * @param       {number} x
     * @param       {number} y
     * @return      {Player}
     */
    constructor(game, x, y) {
        super(game, x, y, 'player');

        this.defaultAttack = config.initialAttack;
        this.defaultDefence = config.initialDefence;
        this.defaultMovement = config.initialMovement;

        this.health = config.initialHealth;

        this.purse = new Purse();

        game.physics.arcade.enable(this);

        this.center();
    }

    getMovementStrategy() {
        return function(turn) {
            return new UserMovementStrategy(turn);
        };
    }

    /**
     * Calculate total number of dices for throwing (modifiers from
     * equipped items plus base value)
     * @private
     * @param   {number} initial The base value
     * @param   {string} prop Name of the property to use
     * @return  {number}
     */
    _getModifiersFor(initial, prop) {
        return reduce(this.purse.getEquippedItems(), (sum, item) => {
            return sum + (item[prop] || 0);
        }, initial);
    }
}