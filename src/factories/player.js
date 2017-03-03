import gameConfig from '../config/gameconfig.json';
import createActor from './actor';
import createPurse from '../factories/purse';

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
function getModifiersFor(purse, initial, prop) {
    return purse.getEquippedItems().reduce((sum, item) => sum + (item[prop] || 0), initial);
}

/**
 * @exports
 * @name Player
 * Factory for creating a player
 * @param {Object} [props={}]
 * @extends {Actor}
 * @returns {Player}
 */
export default function createPlayer(props = {}) {
    const player = Object.assign(
        createActor(),
        {
            initialAttack: config.initialAttack,
            initialDefence: config.initialDefence,
            initialMovementPoints: config.initialMovement,
            initialActionPoints: config.initialActionPoints,
            name: props.name || config.name,
            health: config.initialHealth,
            isPlayerControlled: true,
            purse: createPurse(),
        },
    );

    Object.defineProperties(player, {
        attack: {
            enumerable: true,
            get() { return getModifiersFor(this.purse, this.initialAttack, 'attackModifier'); },
        },
        defence: {
            enumerable: true,
            get() { return getModifiersFor(this.purse, this.initialDefence, 'defenceModifier'); },
        },
        movement: {
            enumerable: true,
            get() { return getModifiersFor(this.purse, this.initialMovementPoints, 'movementModifier'); },
        },

        actionPoints: {
            enumerable: true,
            get() { return getModifiersFor(this.purse, this.initialActionPoints, 'actionPointModifier'); },
        },
    });

    return player;
}
