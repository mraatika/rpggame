import GameEvent from './gameevent';
import EventTypes from '../constants/eventtypes';

/**
 * @class DamageEvent
 * @description An event of an actor being damaged
 * @extends {GameEvent}
 */
export default class DamageEvent extends GameEvent {

    /**
     * @constructor
     * @param       {Actor} actor
     * @param       {number} damage The amount of damage
     * @return      {DamageEvent}
     */
    constructor(actor, damage) {
        super(EventTypes.DAMAGE_EVENT, { actor, damage });
    }
}
