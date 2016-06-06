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
     * @return {number} Default attack plus modifiers from equipment
     */
    get attack() {
        return this._getModifiersFor(this.defaultAttack, 'attackModifier');
    }

    /**
     * Getter for total defence value
     * @return {number} Default defence plus modifiers from equipment
     */
    get defence() {
        return this._getModifiersFor(this.defaultDefence, 'defenceModifier');
    }

    /**
     * Getter for total movement value
     * @return {number} Default movement plus modifiers from equipment
     */
    get movement() {
        return this._getModifiersFor(this.defaultMovement, 'movementModifier');
    }

    /**
     * Getter for total action points
     * @return {number} Default points plus modifiers from equipment
     */
    get actionPoints() {
        return this._getModifiersFor(this.defaultActionPoints, 'actionPointModifier');
    }

    /**
     * @constructor
     * @param       {Game} game
     * @param       {number} x
     * @param       {number} y
     * @return      {Player}
     */
    constructor(game, x, y) {
        super(game, x, y, 'actors', 0);

        this.defaultAttack = config.initialAttack;
        this.defaultDefence = config.initialDefence;
        this.defaultMovement = config.initialMovement;
        this.defaultActionPoints = config.initialActionPoints;

        this.name = 'PLAYER';

        this.health = config.initialHealth;

        this.isPlayerControlled = true;

        this.purse = new Purse();

        game.physics.arcade.enable(this);
    }

    getMovementStrategy(turn) {
        return this._movementStrategy || (this._movementStrategy = new UserMovementStrategy(this, turn));
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