import GameEvent from 'events/gameevent';
import EventTypes from 'events/eventtypes';

/**
 * @class AttackEvent
 * @description An event of an actor attacking another actor
 * @extends {GameEvent}
 */
export default class AttackEvent extends GameEvent {

    /**
     * @constructor
     * @param       {Actor} actor
     * @param       {Actor} target
     * @param       {number} attack The number of successes
     * @return      {AttackEvent}
     */
    constructor(actor, target, attack) {
        super(EventTypes.ATTACK_EVENT, { actor, target, attack });
    }
}