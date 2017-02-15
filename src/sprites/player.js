import Actor from './actor';
import gameConfig from '../config/gameconfig.json';
import Purse from '../classes/purse';

/**
 * Player defaults from game config
 * @type {Object}
 */
const config = gameConfig.player;

/**
 * Calculate total number of dices for throwing (modifiers from
 * equipped items plus base value)
 * @private
 * @param   {number} initial The base value
 * @param   {string} prop Name of the property to use
 * @return  {number}
 */
function getModifiersFor(initial, prop) {
    return this.purse.getEquippedItems().reduce((sum, item) => sum + (item[prop] || 0), initial);
}

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
        return getModifiersFor.call(this, this.defaultAttack, 'attackModifier');
    }

    /**
     * Getter for total defence value
     * @return {number} Default defence plus modifiers from equipment
     */
    get defence() {
        return getModifiersFor.call(this, this.defaultDefence, 'defenceModifier');
    }

    /**
     * Getter for total movement value
     * @return {number} Default movement plus modifiers from equipment
     */
    get movement() {
        return getModifiersFor.call(this, this.defaultMovement, 'movementModifier');
    }

    /**
     * Getter for total action points
     * @return {number} Default points plus modifiers from equipment
     */
    get actionPoints() {
        return getModifiersFor.call(this, this.defaultActionPoints, 'actionPointModifier');
    }

    /**
     * @constructor
     * @param       {Game} game
     * @param       {number} x
     * @param       {number} y
     * @param       {Object} props
     * @return      {Player}
     */
    constructor(game, x, y, props = {}) {
        super(game, x, y, 'actors', 0);

        this.defaultAttack = config.initialAttack;
        this.defaultDefence = config.initialDefence;
        this.defaultMovement = config.initialMovement;
        this.defaultActionPoints = config.initialActionPoints;

        this.name = props.name || config.name;

        this.health = config.initialHealth;

        this.isPlayerControlled = true;

        this.purse = new Purse();
    }
}
