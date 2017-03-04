import gameConfig from '../config/gameconfig.json';
import createActor from './actor';
import createPurse from '../factories/purse';

/**
 * Player defaults from game config
 * @type {Object}
 */
const config = gameConfig.player;

/**
 * @exports
 * @name Player
 * Factory for creating a player
 * @param {Object} [props={}]
 * @extends {Actor}
 * @returns {Player}
 */
export default function createPlayer({ name } = {}) {
    /**
     * Player's private properties
     */
    const privateProps = {
        initialAttack: config.initialAttack,
        initialDefence: config.initialDefence,
        initialMovementPoints: config.initialMovement,
        initialActionPoints: config.initialActionPoints,
    };

    /**
     * Player's public properties
     */
    const publicProps = {
        name: name || config.name,
        health: config.initialHealth,
        isPlayerControlled: true,
        purse: createPurse(),
    };

    /**
     * Calculate total number of dices for throwing (modifiers from
     * equipped items plus base value)
     * @private
     * @param   {number} initial The base value
     * @param   {string} prop Name of the property to use
     * @return  {number}
     */
    function getModifiersFor(initial, prop) {
        return publicProps.purse
            .getEquippedItems()
            .reduce((sum, item) => sum + (item[prop] || 0), initial);
    }

    /**
     * Player's public methods
     */
    const methods = {
        /**
         * Player gets modifiers for attack from items
         * @memberOf Player
         * @returns {number}
         */
        getAttack() {
            return getModifiersFor(privateProps.initialAttack, 'attackModifier');
        },

        /**
         * Player gets modifiers for defence from items
         * @memberOf Player
         * @returns {number}
         */
        getDefence() {
            return getModifiersFor(privateProps.initialDefence, 'defenceModifier');
        },

        /**
         * Player gets modifiers for movement from items
         * @memberOf Player
         * @returns {number}
         */
        getMovement() {
            return getModifiersFor(privateProps.initialMovementPoints, 'movementModifier');
        },

        /**
         * Player might get extra actions from items
         * @memberOf Player
         * @returns {number}
         */
        getActionPoints() {
            return getModifiersFor(privateProps.initialActionPoints, 'actionPointModifier');
        },
    };

    // compose player from actor and player specific properties
    return Object.assign(
        createActor(),
        publicProps,
        methods,
    );
}
